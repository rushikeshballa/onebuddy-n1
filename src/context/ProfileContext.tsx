import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AvatarStyleId =
  | 'cap'
  | 'classic'
  | 'shades'
  | 'wave'
  | 'bun'
  | 'curls'
  | 'specs'
  | 'beard';

export interface AvatarStyle {
  id: AvatarStyleId;
  name: string;
}

export const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'cap', name: 'Cap' },
  { id: 'classic', name: 'Classic' },
  { id: 'shades', name: 'Shades' },
  { id: 'wave', name: 'Wave' },
  { id: 'bun', name: 'Bun' },
  { id: 'curls', name: 'Curls' },
  { id: 'specs', name: 'Specs' },
  { id: 'beard', name: 'Beard' },
];

export interface AvatarColor {
  id: string;
  hex: string;
  name: string;
  isLogoColor?: boolean;
}

export const AVATAR_COLORS: AvatarColor[] = [
  // Classic Palettes matching reference design
  { id: 'lavender', hex: '#594B73', name: 'Lavender' },
  { id: 'plum', hex: '#2A2643', name: 'Plum' },
  { id: 'gold', hex: '#C99E2A', name: 'Gold' },
  { id: 'coral', hex: '#E8684A', name: 'Coral' },
  { id: 'fern', hex: '#589E6E', name: 'Fern' },
  { id: 'sky', hex: '#3C7FB8', name: 'Sky' },
  { id: 'violet', hex: '#8B6BC6', name: 'Violet' },
  { id: 'rose', hex: '#C74E76', name: 'Rose' },

  // OneBuddy Brand & Service Logo Colors
  { id: 'brandGreen', hex: '#65B200', name: 'Brand Green', isLogoColor: true },
  { id: 'foodOrange', hex: '#F07E27', name: 'Food Orange', isLogoColor: true },
  { id: 'rideGold', hex: '#F2A81D', name: 'Rides Amber', isLogoColor: true },
  { id: 'homePurple', hex: '#8E6FD1', name: 'Home Violet', isLogoColor: true },
  { id: 'careBlue', hex: '#3B9BE0', name: 'Care Blue', isLogoColor: true },
];

export interface ProfileData {
  name: string;
  phone: string;
  email: string;
  style: AvatarStyleId;
  color: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: 'User 8225',
  phone: '7013138225',
  email: 'you@example.com',
  style: 'cap',
  color: '#589E6E',
};

const STORAGE_KEY = 'onebuddy:profile';

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: DEFAULT_PROFILE,
  updateProfile: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setProfile((prev) => ({ ...prev, ...JSON.parse(saved) }));
        }
      } catch {
        // Keep default
      }
    })();
  }, []);

  const updateProfile = async (data: Partial<ProfileData>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
