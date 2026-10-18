import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  Avatar,
  Card,
  Coin,
  EmptyState,
  GameCard,
  Pill,
  Screen,
  SectionHeader,
} from '@/components';
import { formatPoints, games, leaderboard, MAX_PLAYS_PER_DAY } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, spacing, type as typo } from '@/theme';
import type { LeaderboardEntry } from '@/types';

export default function PlayScreen() {
  const router = useRouter();
  const { playsLeft } = useBaon();

  const outOfPlays = playsLeft === 0;
  const topThree = leaderboard.slice(0, 3);
  const you = leaderboard.find((entry) => entry.isYou);
  const youInTop = topThree.some((entry) => entry.isYou);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={typo.display}>Laro na!</Text>
        <Text style={[typo.body, styles.subtitle]}>
          Play a quick game, earn your baon. Fresh plays every day.
        </Text>
        <Pill
          label={outOfPlays ? 'No plays left' : `${playsLeft} of ${MAX_PLAYS_PER_DAY} plays left today`}
          icon={outOfPlays ? 'time' : 'flash'}
          tone={outOfPlays ? 'muted' : 'coral'}
        />
      </View>

      {outOfPlays ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            icon="time"
            title="Balik ka bukas!"
            body="You've used all 3 plays for today. Your plays refresh at midnight — see you then."
            actionLabel="Browse rewards"
            onAction={() => router.push('/exchange')}
          />
        </Card>
      ) : (
        <View style={styles.grid}>
          {games.map((game, i) => (
            <Animated.View
              key={game.id}
              entering={FadeInDown.delay(i * 60).springify()}
              style={styles.gridItem}
            >
              <GameCard
                game={game}
                onPress={() => router.push(`/game/${game.id}`)}
              />
            </Animated.View>
          ))}
        </View>
      )}

      <View style={styles.leaderboard}>
        <SectionHeader title="Today's top players" />
        <Card style={styles.leaderCard}>
          {topThree.map((entry, i) => (
            <Animated.View
              key={entry.rank}
              entering={FadeInDown.delay(i * 60).springify()}
            >
              {i > 0 ? <View style={styles.divider} /> : null}
              <LeaderRow entry={entry} />
            </Animated.View>
          ))}
          {!youInTop && you ? (
            <>
              <View style={styles.gap} />
              <LeaderRow entry={you} />
            </>
          ) : null}
        </Card>
      </View>

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

function LeaderRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <View style={[styles.row, entry.isYou && styles.rowYou]}>
      <Text style={[typo.h2, styles.rank, entry.isYou && styles.rankYou]}>{entry.rank}</Text>
      <Avatar uri={entry.avatarUrl} initials={initials(entry.name)} size={38} />
      <Text style={[typo.body, styles.name]} numberOfLines={1}>
        {entry.isYou ? 'You' : entry.name}
      </Text>
      <Coin size={16} color={colors.primaryDark} />
      <Text style={[typo.body, styles.points]}>{formatPoints(entry.points)}</Text>
    </View>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.sm, marginBottom: spacing.lg },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: { width: '48.5%', marginBottom: spacing.md },
  emptyCard: { padding: spacing.sm },
  leaderboard: { marginTop: spacing.xl },
  leaderCard: { paddingVertical: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.button,
  },
  rowYou: { backgroundColor: colors.primarySoft },
  rank: { width: 26, color: colors.textSecondary, textAlign: 'center' },
  rankYou: { color: colors.primaryDark },
  name: { flex: 1, fontWeight: '600', marginLeft: spacing.md, marginRight: spacing.sm },
  points: { fontWeight: '700', color: colors.primaryDark, marginLeft: spacing.xs + 2 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  gap: { height: spacing.sm },
  bottomSpacer: { height: spacing.xxl },
});
