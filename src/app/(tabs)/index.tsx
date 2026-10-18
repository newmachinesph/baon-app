import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  Avatar,
  BalancePill,
  Card,
  Coin,
  PrimaryButton,
  Screen,
  SectionHeader,
  Skeleton,
  StreakBadge,
  TxRow,
} from '@/components';
import { DAILY_CLAIM_POINTS, formatPoints, sponsors, user } from '@/data';
import { photo } from '@/data/images';
import { useBaon } from '@/context/BaonProvider';
import { useCountdown } from '@/hooks/use-countdown';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import type { IconName } from '@/types';

function greetingLabel(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Magandang umaga';
  if (hour < 18) return 'Magandang hapon';
  return 'Magandang gabi';
}

const SPARKLE_OFFSETS = [-56, -28, 0, 28, 56];

function Sparkle({ offset, delay }: { offset: number; delay: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 780 }));
  }, [progress, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: offset },
      { translateY: -96 * progress.value },
      { scale: 0.5 + 0.6 * progress.value },
    ],
  }));
  return (
    <Animated.View style={[styles.sparkle, style]} pointerEvents="none">
      <Coin size={18} color={colors.surface} glyph={colors.primaryDark} />
    </Animated.View>
  );
}

type EarnTile = { icon: IconName; label: string; sub: string; tint: string; onPress: () => void };

export default function HomeScreen() {
  const router = useRouter();
  const {
    balance,
    streak,
    todayClaimed,
    transactions,
    notifications,
    hydrating,
    claimDaily,
  } = useBaon();
  const countdown = useCountdown();

  const [celebrating, setCelebrating] = useState(false);
  const cardScale = useSharedValue(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.get() }] }));

  const handleClaim = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    claimDaily();
    setCelebrating(true);
    cardScale.set(
      withSequence(withTiming(1.05, { duration: 140 }), withTiming(1, { duration: 220 })),
    );
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCelebrating(false), 950);
  };

  const hasUnread = notifications.some((n) => !n.read);
  const recent = transactions.slice(0, 4);
  const todaysSponsor = sponsors.globe;

  const earnTiles: EarnTile[] = [
    {
      icon: 'sunny',
      label: 'Daily claim',
      sub: `+${DAILY_CLAIM_POINTS} pts`,
      tint: colors.primary,
      onPress: () => router.push('/wallet'),
    },
    {
      icon: 'game-controller',
      label: 'Play games',
      sub: 'Up to 500',
      tint: colors.accentCoral,
      onPress: () => router.push('/play'),
    },
    {
      icon: 'people',
      label: 'Refer a friend',
      sub: '+500 pts',
      tint: colors.accentTeal,
      onPress: () => router.push('/referral'),
    },
  ];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar uri={user.avatarUrl} initials={user.initials} size={48} ring />
          <View style={styles.greetingText}>
            <Text style={[typo.caption, styles.greeting]}>{greetingLabel()},</Text>
            <Text style={typo.h1}>{user.firstName}</Text>
          </View>
        </View>
        <Pressable
          style={styles.bell}
          hitSlop={8}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          {hasUnread ? <View style={styles.bellDot} /> : null}
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StreakBadge days={streak} />
        <BalancePill points={balance} onPress={() => router.push('/wallet')} />
      </View>

      {hydrating ? (
        <HomeSkeleton />
      ) : (
        <>
          <Animated.View
            entering={FadeInDown.delay(60).springify()}
            style={[styles.claimShadow, cardStyle]}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.claimCard}
            >
              {celebrating
                ? SPARKLE_OFFSETS.map((offset, i) => (
                    <Sparkle key={offset} offset={offset} delay={i * 60} />
                  ))
                : null}

              {todayClaimed ? (
                <View>
                  <View style={styles.claimTopRow}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.surface} />
                    <Text style={[typo.h2, styles.claimClaimedTitle]}>Baon claimed!</Text>
                  </View>
                  <Text style={[typo.body, styles.claimSub]}>
                    Bukas ulit — next baon in {countdown.label}
                  </Text>
                  <View style={styles.countdownPill}>
                    <Ionicons name="time-outline" size={16} color={colors.surface} />
                    <Text style={styles.countdownText}>{countdown.label}</Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={[typo.caption, styles.claimKicker]}>Baon mo for today!</Text>
                  <View style={styles.claimAmountRow}>
                    <Coin size={30} color={colors.surface} glyph={colors.primaryDark} />
                    <Text style={styles.claimAmount}>+{formatPoints(DAILY_CLAIM_POINTS)}</Text>
                  </View>
                  <Text style={[typo.body, styles.claimSub]}>
                    Your daily points are ready. Grab them before midnight!
                  </Text>
                  <PrimaryButton
                    label="Claim now"
                    icon="sparkles"
                    variant="contrast"
                    onPress={handleClaim}
                    style={styles.claimButton}
                  />
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          <View style={styles.quickRow}>
            <QuickAction
              icon="game-controller"
              label="Play"
              tint={colors.accentCoral}
              onPress={() => router.push('/play')}
            />
            <QuickAction
              icon="gift"
              label="Exchange"
              tint={colors.accentTeal}
              onPress={() => router.push('/exchange')}
            />
          </View>

          <Animated.View entering={FadeInDown.delay(120).springify()}>
            <Card style={styles.sponsorCard} onPress={() => router.push('/play')}>
              <Image
                source={{ uri: photo('baon-sponsor-today') }}
                style={styles.sponsorBackdrop}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.sponsorScrim} />
              <View style={styles.sponsorContent}>
                <View style={styles.sponsorLogoWrap}>
                  <Image
                    source={todaysSponsor.logo}
                    style={styles.sponsorLogo}
                    contentFit="cover"
                    transition={150}
                  />
                </View>
                <View style={styles.sponsorText}>
                  <Text style={[typo.caption, styles.sponsorKicker]}>Today&apos;s sponsor</Text>
                  <Text style={[typo.h2, styles.sponsorName]}>{todaysSponsor.name}</Text>
                  <Text style={[typo.caption, styles.sponsorBlurb]}>
                    Win up to 500 pts in Baon Trivia
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.surface} />
              </View>
            </Card>
          </Animated.View>

          <Text style={[typo.h2, styles.sectionTitle]}>Ways to earn</Text>
          <View style={styles.earnRow}>
            {earnTiles.map((tile, i) => (
              <Animated.View
                key={tile.label}
                entering={FadeInDown.delay(160 + i * 60).springify()}
                style={styles.earnItem}
              >
                <Card style={styles.earnCard} onPress={tile.onPress}>
                  <View style={[styles.earnIcon, { backgroundColor: tile.tint }]}>
                    <Ionicons name={tile.icon} size={20} color={colors.surface} />
                  </View>
                  <Text style={[typo.body, styles.earnLabel]} numberOfLines={1}>
                    {tile.label}
                  </Text>
                  <Text style={[typo.caption, styles.earnSub]}>{tile.sub}</Text>
                </Card>
              </Animated.View>
            ))}
          </View>

          <View style={styles.activitySection}>
            <SectionHeader
              title="Recent activity"
              actionLabel="See all"
              onAction={() => router.push('/wallet')}
            />
            <Card style={styles.activityCard}>
              {recent.map((tx, i) => (
                <Animated.View
                  key={tx.id}
                  entering={FadeInDown.delay(200 + i * 60).springify()}
                >
                  {i > 0 ? <View style={styles.divider} /> : null}
                  <TxRow tx={tx} onPress={() => router.push(`/tx/${tx.id}`)} />
                </Animated.View>
              ))}
            </Card>
          </View>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

function QuickAction({
  icon,
  label,
  tint,
  onPress,
}: {
  icon: IconName;
  label: string;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.quickTile, pressed && styles.quickPressed]}
      onPress={onPress}
    >
      <View style={[styles.quickIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={22} color={colors.surface} />
      </View>
      <Text style={[typo.body, styles.quickLabel]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function HomeSkeleton() {
  return (
    <View>
      <Skeleton height={172} radius={radius.card} style={styles.skClaim} />
      <View style={styles.quickRow}>
        <Skeleton height={64} radius={radius.card} style={styles.skHalf} />
        <Skeleton height={64} radius={radius.card} style={styles.skHalf} />
      </View>
      <Skeleton height={96} radius={radius.card} style={styles.skBlock} />
      <Skeleton width="45%" height={20} style={styles.skTitle} />
      <View style={styles.earnRow}>
        <Skeleton height={104} radius={radius.card} style={styles.earnItem} />
        <Skeleton height={104} radius={radius.card} style={styles.earnItem} />
        <Skeleton height={104} radius={radius.card} style={styles.earnItem} />
      </View>
      <Skeleton height={220} radius={radius.card} style={styles.skBlock} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  greetingText: { marginLeft: spacing.md },
  greeting: { marginBottom: 1 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accentCoral,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  claimShadow: { borderRadius: radius.card, ...shadow.lifted },
  claimCard: {
    borderRadius: radius.card,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  claimKicker: {
    color: colors.primarySoft,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  claimAmountRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  claimAmount: {
    color: colors.surface,
    fontSize: 40,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  claimSub: { color: colors.surface, opacity: 0.92, marginTop: spacing.xs },
  claimButton: { marginTop: spacing.lg },
  claimTopRow: { flexDirection: 'row', alignItems: 'center' },
  claimClaimedTitle: { color: colors.surface, marginLeft: spacing.sm },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: radius.pill,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  countdownText: {
    color: colors.surface,
    fontWeight: '700',
    marginLeft: spacing.xs + 2,
    fontVariant: ['tabular-nums'],
  },
  sparkle: {
    position: 'absolute',
    top: '46%',
    left: '50%',
    marginLeft: -9,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  quickTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.soft,
  },
  quickPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { flex: 1, fontWeight: '700', marginLeft: spacing.md },
  sponsorCard: {
    marginTop: spacing.xl,
    padding: 0,
    overflow: 'hidden',
    minHeight: 96,
  },
  sponsorBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sponsorScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.textPrimary,
    opacity: 0.42,
  },
  sponsorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sponsorLogoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sponsorLogo: { width: 30, height: 30, borderRadius: 15 },
  sponsorText: { flex: 1, marginLeft: spacing.md },
  sponsorKicker: {
    color: colors.surface,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  sponsorName: { color: colors.surface, marginTop: 1 },
  sponsorBlurb: { color: colors.surface, opacity: 0.92, marginTop: 1 },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  earnRow: { flexDirection: 'row', gap: spacing.md },
  earnItem: { flex: 1 },
  earnCard: { padding: spacing.md, alignItems: 'flex-start' },
  earnIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  earnLabel: { fontWeight: '700' },
  earnSub: { color: colors.primaryDark, fontWeight: '700', marginTop: 1 },
  activitySection: { marginTop: spacing.xl },
  activityCard: { paddingVertical: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border },
  bottomSpacer: { height: spacing.xxl },
  // skeleton
  skClaim: { marginBottom: spacing.lg },
  skHalf: { flex: 1 },
  skBlock: { marginTop: spacing.xl },
  skTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
});
