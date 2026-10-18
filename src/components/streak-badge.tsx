import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, sizes, spacing, type as typo } from '@/theme';

interface StreakBadgeProps {
  days: number;
  compact?: boolean;
}

export function StreakBadge({ days, compact = false }: StreakBadgeProps) {
  return (
    <View style={[styles.badge, compact && styles.compact]}>
      <Ionicons name="flame" size={compact ? 14 : 16} color={colors.accentCoral} />
      <Text style={[typo.caption, styles.label]}>
        {compact ? days : `${days}-day streak`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: sizes.pill,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
  },
  compact: { paddingHorizontal: spacing.sm },
  label: { color: colors.textPrimary, fontWeight: '700', marginLeft: spacing.xs + 1 },
});
