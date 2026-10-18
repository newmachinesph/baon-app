import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import type { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onPress: () => void;
  disabled?: boolean;
}

export function GameCard({ game, onPress, disabled }: GameCardProps) {
  const soon = game.status === 'soon';
  const blocked = Boolean(disabled) || soon;

  return (
    <Pressable
      onPress={onPress}
      disabled={blocked}
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked }}
      accessibilityLabel={soon ? `${game.title}, coming soon` : game.title}
      style={({ pressed }) => [
        styles.card,
        soon && styles.cardSoon,
        pressed && !blocked && styles.pressed,
        disabled && !soon && styles.dim,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconTile, { backgroundColor: game.tint }, soon && styles.tileSoon]}>
          <Ionicons name={game.icon} size={24} color={colors.surface} />
        </View>
        {soon ? (
          <View style={styles.soonPill}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.soonText} numberOfLines={1}>
              Soon
            </Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        )}
      </View>

      <Text style={[typo.h2, styles.title, soon && styles.mutedText]} numberOfLines={1}>
        {game.title}
      </Text>
      <Text style={[typo.caption, styles.blurb]} numberOfLines={2}>
        {game.blurb}
      </Text>

      <Text style={[typo.caption, styles.range, soon && styles.rangeSoon]}>
        {game.minReward}–{game.maxReward} pts
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.soft,
  },
  cardSoon: { backgroundColor: colors.background },
  pressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
  dim: { opacity: 0.5 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSoon: { opacity: 0.45 },
  title: { marginBottom: 2 },
  mutedText: { color: colors.textSecondary },
  blurb: { minHeight: 34, color: colors.textSecondary },
  range: { color: colors.primaryDark, fontWeight: '700', marginTop: spacing.sm },
  rangeSoon: { color: colors.textSecondary },
  soonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  soonText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
});
