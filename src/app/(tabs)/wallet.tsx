import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, Coin, EmptyState, Screen, Skeleton, TxRow } from '@/components';
import { formatPeso, formatPoints, pointsToPeso } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import type { IconName, Transaction } from '@/types';

type Filter = 'all' | 'earned' | 'redeemed';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'earned', label: 'Earned' },
  { id: 'redeemed', label: 'Redeemed' },
];

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// ponytail: the "this week" window is pinned at app load, not per render — Date.now() during
// render is impure and React Compiler rejects it. Fine for a demo; recompute on focus if a
// session ever spans midnight.
const WEEK_CUTOFF = Date.now() - WEEK_MS;

const EMPTY_COPY: Record<Filter, { icon: IconName; title: string; body: string }> = {
  all: {
    icon: 'receipt-outline',
    title: 'No activity yet',
    body: 'Claim your daily baon or play a game to start stacking points.',
  },
  earned: {
    icon: 'sunny-outline',
    title: 'Nothing earned yet',
    body: 'Your claims, game wins, and bonuses will show up here.',
  },
  redeemed: {
    icon: 'gift-outline',
    title: 'No redemptions yet',
    body: 'Exchange your points for load, data, or vouchers to see them here.',
  },
};

export default function WalletScreen() {
  const router = useRouter();
  const { balance, streak, transactions, hydrating, refresh } = useBaon();

  const [filter, setFilter] = useState<Filter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const earnedThisWeek = useMemo(
    () =>
      transactions.reduce(
        (sum, tx) =>
          tx.amount > 0 && new Date(tx.date).getTime() >= WEEK_CUTOFF ? sum + tx.amount : sum,
        0,
      ),
    [transactions],
  );

  const filtered = useMemo(() => {
    if (filter === 'earned') return transactions.filter((tx) => tx.amount > 0);
    if (filter === 'redeemed') return transactions.filter((tx) => tx.amount < 0);
    return transactions;
  }, [transactions, filter]);

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <Text style={[typo.display, styles.heading]}>Wallet</Text>

      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={[typo.caption, styles.balanceLabel]}>Your baon balance</Text>
        <View style={styles.balanceRow}>
          <Coin size={34} color={colors.surface} glyph={colors.primaryDark} />
          <Text style={styles.balanceValue}>{formatPoints(balance)}</Text>
        </View>
        <Text style={[typo.body, styles.peso]}>
          ≈ {formatPeso(pointsToPeso(balance))}
        </Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <StatCard
          icon="flame"
          tint={colors.accentCoral}
          value={`${streak} days`}
          label="Current streak"
        />
        <StatCard
          icon="trending-up"
          tint={colors.success}
          value={`+${formatPoints(earnedThisWeek)}`}
          label="Earned this week"
        />
      </View>

      <View style={styles.segment}>
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.segmentItem, active && styles.segmentItemActive]}
              onPress={() => setFilter(item.id)}
            >
              <Text style={[typo.caption, styles.segmentText, active && styles.segmentTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {hydrating ? (
        <WalletSkeleton />
      ) : filtered.length === 0 ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            icon={EMPTY_COPY[filter].icon}
            title={EMPTY_COPY[filter].title}
            body={EMPTY_COPY[filter].body}
          />
        </Card>
      ) : (
        <Card style={styles.listCard}>
          {filtered.map((tx: Transaction, i) => (
            <Animated.View key={tx.id} entering={FadeInDown.delay(Math.min(i, 8) * 45).springify()}>
              {i > 0 ? <View style={styles.divider} /> : null}
              <TxRow tx={tx} onPress={() => router.push(`/tx/${tx.id}`)} />
            </Animated.View>
          ))}
        </Card>
      )}

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

function StatCard({
  icon,
  tint,
  value,
  label,
}: {
  icon: IconName;
  tint: string;
  value: string;
  label: string;
}) {
  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={18} color={colors.surface} />
      </View>
      <Text style={[typo.h1, styles.statValue]}>{value}</Text>
      <Text style={[typo.caption, styles.statLabel]}>{label}</Text>
    </Card>
  );
}

function WalletSkeleton() {
  return (
    <Card style={styles.listCard}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skRow}>
          <Skeleton width={40} height={40} radius={radius.button} />
          <View style={styles.skText}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="30%" height={12} style={styles.skGap} />
          </View>
          <Skeleton width={54} height={16} />
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { marginTop: spacing.sm, marginBottom: spacing.lg },
  balanceCard: {
    borderRadius: radius.card,
    padding: spacing.xl,
    ...shadow.lifted,
  },
  balanceLabel: {
    color: colors.primarySoft,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  balanceValue: {
    color: colors.surface,
    fontSize: 44,
    fontWeight: '800',
    marginLeft: spacing.md,
  },
  peso: { color: colors.surface, opacity: 0.92, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  statCard: { flex: 1, alignItems: 'flex-start', padding: spacing.md },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 20 },
  statLabel: { marginTop: 1 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    padding: 4,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  segmentItemActive: { backgroundColor: colors.surface, ...shadow.soft },
  segmentText: { fontWeight: '700', color: colors.primaryDark },
  segmentTextActive: { color: colors.textPrimary },
  listCard: { paddingVertical: spacing.xs },
  emptyCard: { padding: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border },
  bottomSpacer: { height: spacing.xxl },
  skRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  skText: { flex: 1, marginLeft: spacing.md },
  skGap: { marginTop: spacing.xs + 2 },
});
