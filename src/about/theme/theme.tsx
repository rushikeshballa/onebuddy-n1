// theme.ts
// Central design tokens so every screen stays visually consistent.

export const colors = {
  background: '#121214',      // OneBuddy deep dark background
  sheetBackground: '#1D1E22', // OneBuddy card surface background
  cardBackground: '#24262B',  // OneBuddy elevated button/card background
  border: 'rgba(255, 255, 255, 0.08)', // hairline dividers
  gold: '#7EC400',            // OneBuddy brand logo accent (title text, highlighted values, banner text)
  goldSoft: 'rgba(126, 196, 0, 0.15)', // icon chip background for brand icon
  purpleChip: 'rgba(126, 196, 0, 0.15)', // icon chip background for policy/terms icons
  purpleIcon: '#7EC400',      // icon tint matching logo accent
  textPrimary: '#F1F1EC',
  textSecondary: '#9BA08F',
  chevron: '#6B7266',
  handleBar: 'rgba(255, 255, 255, 0.2)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.textPrimary,
  },
  banner: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.gold,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.gold,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: colors.textPrimary,
  },
  paragraph: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 23,
  },
};
