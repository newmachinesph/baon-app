import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type as typo } from '@/theme';
import { formatPoints } from '@/data';
import type { Transaction, TxKind } from '@/types';

interface TxRowProps {
  tx: Transaction;
  onPress?: () => void;
}

const KIND_TINT: Record<TxKind, string> = {
  claim: colors.primary,
  game: colors.accentCoral,
  redeem: colors.accentTeal,
  bonus: colors.primaryDark,
  referral: colors.accentTeal,
};

/** "2h ago" / "Yesterday" / "Mar 4" — relative for the last week, absolute beyond. */
function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TxRow({ tx, onPress }: TxRowProps) {
  const earned = tx.amount >= 0;
  const sign = earned ? '+' : '−';
  const amountColor = earned ? colors.success : colors.textPrimary;

  const body = (
    <View style={styles.row}>
      <View style={[styles.iconTile, { backgroundColor: KIND_TINT[tx.kind] }]}>
        <Ionicons name={tx.icon} size={18} color={colors.surface} />
      </View>
      <View style={styles.info}>
        <Text style={[typo.body, styles.title]} numberOfLines={1}>
          {tx.title}
        </Text>
        <Text style={[typo.caption, styles.date]} numberOfLines={1}>
          {relativeDate(tx.date)}
        </Text>
      </View>
      <Text style={[typo.body, styles.amount, { color: amountColor }]}>
        {sign}
        {formatPoints(Math.abs(tx.amount))}
      </Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: spacing.md },
  title: { fontWeight: '600' },
  date: { marginTop: 1 },
  amount: { fontWeight: '700', marginLeft: spacing.sm },
  pressed: { opacity: 0.7 },
});
