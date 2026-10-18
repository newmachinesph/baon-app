import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type as typo } from '@/theme';
import type { IconName } from '@/types';

type PillTone = 'gold' | 'teal' | 'coral' | 'muted' | 'success' | 'danger';

interface PillProps {
  label: string;
  icon?: IconName;
  tone?: PillTone;
  selected?: boolean;
  onPress?: () => void;
}

const TONE_COLOR: Record<PillTone, string> = {
  gold: colors.primary,
  teal: colors.accentTeal,
  coral: colors.accentCoral,
  muted: colors.textSecondary,
  success: colors.success,
  danger: colors.danger,
};

export function Pill({ label, icon, tone = 'muted', selected = false, onPress }: PillProps) {
  const accent = TONE_COLOR[tone];
  const fg = selected ? colors.surface : accent;

  const body = (
    <View
      style={[
        styles.pill,
        selected
          ? { backgroundColor: accent, borderColor: accent }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {icon ? <Ionicons name={icon} size={14} color={fg} style={styles.icon} /> : null}
      <Text style={[typo.caption, styles.label, { color: fg }]}>{label}</Text>
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
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: { fontWeight: '600' },
  icon: { marginRight: spacing.xs + 2 },
  pressed: { opacity: 0.8 },
});
