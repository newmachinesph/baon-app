import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import { formatPeso, formatPoints } from '@/data';
import type { Reward } from '@/types';
import { Coin } from './coin';
import { SponsorChip } from './sponsor-chip';

interface RewardCardProps {
  reward: Reward;
  onPress: () => void;
  affordable: boolean;
}

export function RewardCard({ reward, onPress, affordable }: RewardCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: reward.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {reward.limited ? (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>Limited</Text>
          </View>
        ) : null}
        {!affordable ? (
          <View style={styles.lockDim}>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={14} color={colors.textSecondary} />
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <SponsorChip sponsorId={reward.sponsorId} size="sm" />
        <Text style={[typo.h2, styles.title]} numberOfLines={1}>
          {reward.title}
        </Text>
        <Text style={[typo.caption, styles.subtitle]} numberOfLines={1}>
          {reward.subtitle}
        </Text>

        <View style={styles.priceRow}>
          <Coin size={18} color={colors.primaryDark} />
          <Text style={[typo.h2, styles.points]}>{formatPoints(reward.pointCost)}</Text>
          <Text style={[typo.caption, styles.peso]}>{formatPeso(reward.pesoValue)}</Text>
        </View>

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.soft,
  },
  pressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
  imageWrap: { height: 128, backgroundColor: colors.primarySoft },
  image: { width: '100%', height: '100%' },
  ribbon: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.accentCoral,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  ribbonText: { color: colors.surface, fontSize: 11, fontWeight: '700' },
  lockDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    opacity: 0.62,
  },
  lockBadge: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  body: { padding: spacing.md },
  title: { marginTop: spacing.sm },
  subtitle: { marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  points: { color: colors.primaryDark, marginLeft: spacing.xs + 2 },
  peso: { marginLeft: spacing.sm },
});
