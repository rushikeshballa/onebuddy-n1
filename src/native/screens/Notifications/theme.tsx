/**
 * Design tokens ported 1:1 from the web app's src/index.css custom
 * properties, so the React Native screen matches OneBuddy's existing
 * dark / glass / gold look exactly.
 */
import type { CategoryId } from './types'

export const colors = {
  lavenderDeep: '#2E2440',
  lavender: '#5A4A73',
  lavenderLight: '#9C8AC4',
  gold: '#C9A227',
  goldLight: '#E8C767',
  bgDeep: '#0D0912',
  ink: '#15121F',
  mist: '#EDEAF6',
  mistDim: '#B8AFCB',

  food: '#E8734A',
  foodLt: '#F5A67D',
  grocery: '#4C9A6A',
  groceryLt: '#7CC79A',
  ride: '#3E7CB1',
  rideLt: '#6FA8D9',
  home: '#8B6CC9',
  homeLt: '#B39EE0',
  medical: '#C9557A',
  medicalLt: '#E8859F',

  glassBg: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  rowDivider: 'rgba(255,255,255,0.06)',
  overlay: 'rgba(6,4,10,0.5)',
  headerBg: 'rgba(13,9,18,0.9)',
} as const

/** Per-category tab gradient — same pairing used on the web tabs
 *  (notif-tab-{id}.active) and the home screen's category cards. */
export const CATEGORY_GRADIENTS: Record<CategoryId, [string, string]> = {
  food: [colors.foodLt, colors.food],
  groceries: [colors.groceryLt, colors.grocery],
  rides: [colors.rideLt, colors.ride],
  health: [colors.medicalLt, colors.medical],
  homeServices: [colors.homeLt, colors.home],
}

export const spacing = { sm: 8, md: 14, lg: 20, xl: 28 } as const
export const radius = { pill: 999, card: 20, sm: 12 } as const
