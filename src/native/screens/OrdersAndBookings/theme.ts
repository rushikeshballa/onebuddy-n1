import type { Category, Filter, StatusKind } from './types';

// Per-tab active colors matching OneBuddy logo and brand category colors
export const TAB_ACTIVE_COLORS: Record<Filter, { bg: string; fg: string }> = {
  all: { bg: '#5FA300', fg: '#FFFFFF' },
  food: { bg: '#F07E27', fg: '#FFFFFF' },
  groceries: { bg: '#6DBE45', fg: '#FFFFFF' },
  rides: { bg: '#F2A81D', fg: '#17240A' },
  healthcare: { bg: '#3B9BE0', fg: '#FFFFFF' },
  homeservices: { bg: '#8E6FD1', fg: '#FFFFFF' },
};

// Per-category icon tint using OneBuddy brand palette
export const CATEGORY_TINT: Record<Category, { bg: string; fg: string }> = {
  food: { bg: 'rgba(240, 126, 39, 0.16)', fg: '#F07E27' },
  groceries: { bg: 'rgba(109, 190, 69, 0.16)', fg: '#6DBE45' },
  rides: { bg: 'rgba(242, 168, 29, 0.16)', fg: '#F2A81D' },
  healthcare: { bg: 'rgba(59, 155, 224, 0.16)', fg: '#3B9BE0' },
  homeservices: { bg: 'rgba(142, 111, 209, 0.16)', fg: '#8E6FD1' },
};

// Badge color per status kind using OneBuddy brand tokens
export const BADGE_COLOR: Record<StatusKind, { bg: string; fg: string }> = {
  ongoing: { bg: 'rgba(95, 163, 0, 0.16)', fg: '#7EC400' },
  upcoming: { bg: 'rgba(109, 190, 69, 0.16)', fg: '#96D477' },
  done: { bg: 'rgba(255, 255, 255, 0.08)', fg: '#9BA08F' },
};

// Section label accent matching OneBuddy brand logo
export const SECTION_LABEL_COLOR = '#5FA300';

// Shared surface + text colors matching OneBuddy theme
export const COLORS = {
  page: '#121214',
  screen: '#121214',
  card: '#1D1E22',
  chip: '#24262B',
  borderScreen: 'rgba(255, 255, 255, 0.08)',
  borderCard: 'rgba(255, 255, 255, 0.08)',
  borderAction: 'rgba(126, 196, 0, 0.35)',
  text: '#F1F1EC',
  textMuted: '#9BA08F',
  textFaint: '#6B7266',
  textChip: '#F1F1EC',
  textAction: '#7EC400',
};
