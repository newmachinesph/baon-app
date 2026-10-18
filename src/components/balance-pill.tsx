import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, sizes, spacing, type as typo } from '@/theme';
import { formatPoints } from '@/data';
import { Coin } from './coin';

interface BalancePillProps {
  points: number;
  onPress?: () => void;
  size?: 'sm' | 'lg';
}

export function BalancePill({ points, onPress, size = 'sm' }: BalancePillProps) {
  const large = size === 'lg';
  const coinSize = large ? 26 : 18;

  const body = (
    <View style={[styles.pill, large ? styles.lg : styles.sm]}>
      <Coin size={coinSize} color={colors.primaryDark} />
      <Text style={[large ? typo.h1 : typo.h2, styles.value]}>{formatPoints(points)}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {body}
      </Pressable>
    );
  }
  return body;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  sm: { height: sizes.pill, paddingHorizontal: spacing.sm + 2 },
  lg: { height: sizes.pillLg, paddingHorizontal: spacing.md + 2 },
  value: { color: colors.primaryDark, marginLeft: spacing.sm },
  pressed: { opacity: 0.85 },
});
