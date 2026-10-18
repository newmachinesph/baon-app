import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  primary: '#F2A81D',
  primaryDark: '#D98A00',
  primarySoft: '#FDECC8',
  background: '#FFFBF4',
  surface: '#FFFFFF',
  accentTeal: '#0E9384',
  accentCoral: '#F2764B',
  textPrimary: '#2B2620',
  textSecondary: '#857A6B',
  success: '#17936A',
  danger: '#D64545',
  border: '#F0E7D8',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  card: 18,
  pill: 999,
  button: 14,
} as const;

/** Fixed control heights, so pills that sit on the same row line up regardless of their content. */
export const sizes = {
  pill: 36,
  pillLg: 44,
} as const;

/** Low-elevation only — Baon reads warm and flat, never heavy. */
export const shadow = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#B08A3E',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 2 },
    default: {},
  })!,
  lifted: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#B08A3E',
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 5 },
    default: {},
  })!,
} as const;

// Platform sans (San Francisco on iOS, Roboto on Android) — no custom faces to load.
export const type = {
  display: { fontSize: 28, fontWeight: '700', color: colors.textPrimary } as TextStyle,
  h1: { fontSize: 22, fontWeight: '700', color: colors.textPrimary } as TextStyle,
  h2: { fontSize: 18, fontWeight: '600', color: colors.textPrimary } as TextStyle,
  body: { fontSize: 15, fontWeight: '400', color: colors.textPrimary } as TextStyle,
  caption: { fontSize: 13, fontWeight: '500', color: colors.textSecondary } as TextStyle,
} as const;

export const theme = { colors, spacing, radius, shadow, type };
export default theme;
