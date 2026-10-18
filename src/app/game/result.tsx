import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Card, Coin, PrimaryButton, SecondaryButton } from '@/components';
import { formatPoints } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, spacing, type as typo } from '@/theme';

const { width: W, height: H } = Dimensions.get('window');
const CONFETTI_COLORS = [
  colors.primary,
  colors.accentTeal,
  colors.accentCoral,
  colors.primaryDark,
  colors.success,
];

type PieceProps = { left: number; delay: number; color: string; size: number };

function ConfettiPiece({ left, delay, color, size }: PieceProps) {
  const y = useSharedValue(-40);
  const spin = useSharedValue(0);

  useEffect(() => {
    y.set(withDelay(delay, withTiming(H + 40, { duration: 2000 })));
    spin.set(withRepeat(withTiming(1, { duration: 700 }), -1, false));
  }, [y, spin, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.get() }, { rotate: `${spin.get() * 360}deg` }],
  }));

  return (
    <Animated.View
      style={[{ position: 'absolute', left, width: size, height: size, backgroundColor: color, borderRadius: 2 }, style]}
    />
  );
}

/** Deterministic 0..1 from an integer — keeps confetti scatter out of render-time randomness. */
function jitter(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Confetti() {
  const pieces = useMemo<PieceProps[]>(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: jitter(i, 1) * W,
        delay: jitter(i, 2) * 500,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + jitter(i, 3) * 6,
      })),
    [],
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} {...p} />
      ))}
    </View>
  );
}

export default function GameResultScreen() {
  const { points, correct, total, gameId } = useLocalSearchParams<{
    points?: string;
    correct?: string;
    total?: string;
    gameId?: string;
  }>();
  const router = useRouter();
  const { balance, playsLeft } = useBaon();

  const earned = Number(points ?? 0);
  const hasScore = correct !== undefined && total !== undefined;
  const canReplay = playsLeft > 0 && Boolean(gameId);

  const replay = (): void => {
    router.replace({ pathname: '/game/[id]', params: { id: gameId ?? 'trivia' } });
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <Confetti />
      <View style={styles.center}>
        <Animated.View entering={FadeInDown.springify()} style={styles.hero}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[typo.display, styles.panalo]}>Panalo!</Text>
          <Text style={[typo.body, styles.sub]}>Your baon is in the Wallet.</Text>
        </Animated.View>

        <Card style={styles.card}>
          <Text style={[typo.caption, styles.earnedLabel]}>Points earned</Text>
          <View style={styles.earnedRow}>
            <Coin size={30} />
            <Text style={styles.earnedValue}>{formatPoints(earned)}</Text>
          </View>

          {hasScore ? (
            <View style={styles.scoreRow}>
              <Text style={[typo.body, styles.scoreText]}>
                {correct} of {total} correct
              </Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.balanceRow}>
            <Text style={[typo.caption, styles.balanceLabel]}>New balance</Text>
            <View style={styles.balanceVal}>
              <Coin size={18} />
              <Text style={styles.balanceText}>{formatPoints(balance)}</Text>
            </View>
          </View>
        </Card>

        <PrimaryButton
          label="Play again"
          icon="refresh"
          disabled={!canReplay}
          onPress={replay}
          style={styles.action}
        />
        <SecondaryButton
          label="Done"
          icon="home"
          onPress={() => router.replace('/(tabs)')}
          style={styles.action}
        />
        {!canReplay ? (
          <Text style={[typo.caption, styles.noPlays]}>No plays left today — bukas ulit!</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 56 },
  panalo: { marginTop: spacing.sm, color: colors.textPrimary },
  sub: { color: colors.textSecondary, marginTop: spacing.xs },
  card: { alignItems: 'center' },
  earnedLabel: { textTransform: 'uppercase', letterSpacing: 1 },
  earnedRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  earnedValue: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.primaryDark,
    marginLeft: spacing.md,
  },
  scoreRow: { marginTop: spacing.sm },
  scoreText: { color: colors.textSecondary },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  balanceLabel: { textTransform: 'uppercase', letterSpacing: 1 },
  balanceVal: { flexDirection: 'row', alignItems: 'center' },
  balanceText: { ...typo.h2, marginLeft: spacing.xs + 2, color: colors.textPrimary },
  action: { alignSelf: 'stretch', marginTop: spacing.md },
  noPlays: { textAlign: 'center', marginTop: spacing.md },
});
