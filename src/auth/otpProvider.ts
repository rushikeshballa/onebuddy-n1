/**
 * OTP transport.
 *
 * The old WebView auth flow did not send anything: `src/scripts/main.js`
 * accepted any six digits and called `enterApp()`. There was no Fast2SMS
 * call, no generated code and no verification, so there was nothing to port.
 *
 * This module is the seam where a real one goes. Everything above it —
 * `OtpAuthContext`, `AuthScreen` — only ever calls `sendOtp`
 * and `verifyOtp`, so swapping the provider is a change to this file alone.
 *
 * IMPORTANT: do not call an SMS gateway directly from here. The API key would
 * ship inside the app bundle, where anyone can pull it out of the APK and
 * spend your credits. Put the gateway behind your own endpoint and have
 * `HttpOtpProvider` call that.
 */

export interface OtpProvider {
  /** Ask the backend to send a code. Resolves once it has been dispatched. */
  sendOtp(identifier: string): Promise<void>;
  /** Resolves with a session token when the code is right, rejects when not. */
  verifyOtp(identifier: string, code: string): Promise<{ token: string }>;
}

export class OtpError extends Error {}

export const OTP_LENGTH = 6;
/** Seconds before "Resend OTP" becomes tappable again. Matches the old RESEND. */
export const OTP_RESEND_SECONDS = 30;

/** `you@example.com` or a 10–15 digit phone, same test the old page used. */
export function looksValidIdentifier(value: string): boolean {
  const trimmed = value.trim();
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed) ||
    /^[+]?[\d\s-]{10,15}$/.test(trimmed)
  );
}

/**
 * Development provider. Generates a code locally and logs it to Metro so the
 * flow is walkable on a device before any backend exists. It never sends an
 * SMS, and it is refused in release builds so it cannot ship by accident.
 */
export class DevOtpProvider implements OtpProvider {
  private codes = new Map<string, string>();

  async sendOtp(identifier: string): Promise<void> {
    if (!__DEV__) {
      throw new OtpError('No OTP provider is configured for release builds.');
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.codes.set(identifier.trim(), code);
    // eslint-disable-next-line no-console
    console.log(`[otp] code for ${identifier.trim()} is ${code}`);
  }

  async verifyOtp(identifier: string, code: string): Promise<{ token: string }> {
    const expected = this.codes.get(identifier.trim());
    if (!expected) throw new OtpError('Request a code first.');
    if (expected !== code) throw new OtpError('That code is not right. Try again.');
    this.codes.delete(identifier.trim());
    return { token: `dev-${Date.now()}` };
  }
}

/**
 * Talks to your own backend. Swap `provider` below to this once the two
 * endpoints exist; nothing else in the app changes.
 */
export class HttpOtpProvider implements OtpProvider {
  constructor(private readonly baseUrl: string) {}

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      const message = typeof payload.message === 'string' ? payload.message : undefined;
      throw new OtpError(message ?? 'Could not reach the server. Check your connection.');
    }
    return payload as T;
  }

  sendOtp(identifier: string): Promise<void> {
    return this.post<void>('/auth/send-otp', { identifier: identifier.trim() });
  }

  verifyOtp(identifier: string, code: string): Promise<{ token: string }> {
    return this.post<{ token: string }>('/auth/verify-otp', {
      identifier: identifier.trim(),
      code,
    });
  }
}

/** The single line to change when the backend is ready. */
export const provider: OtpProvider = new DevOtpProvider();
