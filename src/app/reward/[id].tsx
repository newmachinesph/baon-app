import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Card,
  Coin,
  ConfirmSheet,
  EmptyState,
  Pill,
  PrimaryButton,
  SecondaryButton,
  SponsorChip,
} from '@/components';
import { formatPeso, formatPoints, rewards } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </Pressable>
      <Text style={[typo.h1, styles.headerTitle]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

export default function RewardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { balance, redeemReward } = useBaon();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reward = rewards.find((r) => r.id === id);

  if (!reward) {
    return (
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <Header title="Reward" onBack={() => router.back()} />
        <EmptyState
          icon="pricetags-outline"
          title="Reward not found"
          body="This one may have expired or been fully claimed. Browse today's rewards instead."
          actionLabel="Back to Exchange"
          onAction={() => router.replace('/(tabs)/exchange')}
        />
      </SafeAreaView>
    );
  }

  const affordable = balance >= reward.pointCost;
  const shortfall = reward.pointCost - balance;

  const handleConfirm = () => {
    setSheetOpen(false);
    const result = redeemReward(reward);
    if (result.ok) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/redeem/[id]', params: { id: reward.id, code: result.code } });
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(
        result.reason === 'insufficient'
          ? 'Not enough points for this reward yet.'
          : 'Sorry, this reward just went out of stock.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <View style={styles.headerPad}>
        <Header title="Reward" onBack={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.springify()}>
          <Image
            source={{ uri: reward.imageUrl }}
            style={styles.hero}
            contentFit="cover"
            transition={200}
          />
        </Animated.View>

        <View style={styles.pad}>
          <View style={styles.rowBetween}>
            <SponsorChip sponsorId={reward.sponsorId} size="md" />
            {reward.limited ? (
              <Pill label={`${reward.stock} left`} icon="flame" tone="coral" />
            ) : null}
          </View>

          <Text style={[typo.display, styles.title]}>{reward.title}</Text>
          <Text style={[typo.body, styles.subtitle]}>{reward.subtitle}</Text>

          <Card style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Coin size={26} />
              <Text style={styles.pricePts}>{formatPoints(reward.pointCost)}</Text>
              <Text style={styles.pricePtsLabel}>pts</Text>
            </View>
            <Text style={styles.pricePeso}>Worth {formatPeso(reward.pesoValue)}</Text>
          </Card>

          <Text style={[typo.h2, styles.sectionTitle]}>What you get</Text>
          {reward.terms.map((t, i) => (
            <View key={i} style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={[typo.body, styles.bulletText]}>{t}</Text>
            </View>
          ))}

          <Card style={styles.noteCard}>
            <Ionicons name="information-circle" size={20} color={colors.accentTeal} />
            <Text style={[typo.caption, styles.noteText]}>
              Baon points are sponsor-funded and only exchange for goods like this — never cash. What
              you claim here is yours to keep.
            </Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!affordable ? (
          <View style={styles.shortPanel}>
            <View style={styles.shortRow}>
              <Ionicons name="hourglass" size={18} color={colors.primaryDark} />
              <Text style={[typo.body, styles.shortTitle]}>Not enough points</Text>
            </View>
            <Text style={[typo.caption, styles.shortBody]}>
              Konti na lang! {formatPoints(shortfall)} points to go.
            </Text>
            <SecondaryButton
              label="Play to earn"
              icon="game-controller"
              onPress={() => router.replace('/(tabs)/play')}
              style={styles.playBtn}
            />
          </View>
        ) : error ? (
          <Text style={[typo.caption, styles.error]}>{error}</Text>
        ) : null}

        <PrimaryButton
          label={`Redeem for ${formatPoints(reward.pointCost)} pts`}
          icon="pricetag"
          disabled={!affordable}
          onPress={() => setSheetOpen(true)}
        />
      </View>

      <ConfirmSheet
        visible={sheetOpen}
        title="Redeem this reward?"
        body={`This uses ${formatPoints(reward.pointCost)} points for ${reward.title}. A redemption can't be undone.`}
        confirmLabel="Yes, redeem"
        onConfirm={handleConfirm}
        onCancel={() => setSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  headerPad: { paddingHorizontal: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: { marginLeft: spacing.md, flex: 1 },
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    width: '100%',
    height: 220,
    backgroundColor: colors.primarySoft,
  },
  pad: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { marginTop: spacing.md, fontSize: 24 },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs },
  priceCard: { marginTop: spacing.lg },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  pricePts: {
    ...typo.display,
    marginLeft: spacing.sm,
    color: colors.primaryDark,
  },
  pricePtsLabel: {
    ...typo.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  pricePeso: { ...typo.caption, marginTop: spacing.xs },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  bulletText: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    backgroundColor: colors.background,
  },
  noteText: { flex: 1, marginLeft: spacing.sm, lineHeight: 19 },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.lifted,
  },
  shortPanel: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  shortRow: { flexDirection: 'row', alignItems: 'center' },
  shortTitle: { fontWeight: '700', marginLeft: spacing.sm, color: colors.textPrimary },
  shortBody: { marginTop: spacing.xs, color: colors.textSecondary },
  playBtn: { marginTop: spacing.md, alignSelf: 'stretch', backgroundColor: colors.surface },
  error: { color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
});
