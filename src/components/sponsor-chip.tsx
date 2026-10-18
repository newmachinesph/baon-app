import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, spacing, type as typo } from '@/theme';
import { sponsors } from '@/data';
import type { SponsorId } from '@/types';

interface SponsorChipProps {
  sponsorId: SponsorId;
  size?: 'sm' | 'md';
}

/**
 * Relative luminance (WCAG). Brand tints are supplied by the sponsor, so the readable
 * foreground has to be derived rather than assumed — today they are all dark, but a
 * light-tinted sponsor would render invisible white-on-white otherwise.
 */
function isDark(hex: string): boolean {
  const n = parseInt(hex.replace('#', ''), 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.45;
}

export function SponsorChip({ sponsorId, size = 'sm' }: SponsorChipProps) {
  const sponsor = sponsors[sponsorId];
  const logoSize = size === 'md' ? 20 : 16;
  const fg = isDark(sponsor.tint) ? colors.surface : colors.textPrimary;

  return (
    <View
      style={[
        styles.chip,
        size === 'md' ? styles.md : styles.sm,
        { backgroundColor: sponsor.tint },
      ]}
    >
      {/* A white disc under the mark: brand logos are drawn for white, and several
          (Globe blue, Smart green) would otherwise sit invisibly on their own tint. */}
      <View
        style={[
          styles.logoDisc,
          { width: logoSize, height: logoSize, borderRadius: logoSize / 2 },
        ]}
      >
        <Image
          source={sponsor.logo}
          style={styles.logo}
          contentFit="contain"
          transition={150}
        />
      </View>
      <Text style={[typo.caption, styles.name, { color: fg }]} numberOfLines={1}>
        {sponsor.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
  },
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  md: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
  logoDisc: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  logo: { width: '78%', height: '78%' },
  name: { fontWeight: '700', marginLeft: spacing.xs + 2 },
});
