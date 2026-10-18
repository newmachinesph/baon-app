import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar, Card, Coin, Pill, Screen } from '@/components';
import { formatPoints } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import type { IconName } from '@/types';

type MenuItem = {
  icon: IconName;
  label: string;
  tint: string;
  onPress: () => void;
  danger?: boolean;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, balance, transactions } = useBaon();

  const { earned, redeemed } = useMemo(() => {
    let e = 0;
    let r = 0;
    for (const tx of transactions) {
      if (tx.amount > 0) e += tx.amount;
      else r += Math.abs(tx.amount);
    }
    return { earned: e, redeemed: r };
  }, [transactions]);

  const verifiedLabel =
    user.verifiedWith === 'egovph' ? 'National ID • Verified' : 'Mobile • Verified';

  const menu: MenuItem[] = [
    {
      icon: 'shield-checkmark-outline',
      label: 'Identity & verification',
      tint: colors.accentTeal,
      onPress: () => router.push('/identity'),
    },
    {
      icon: 'people-outline',
      label: 'Refer a friend',
      tint: colors.primary,
      onPress: () => router.push('/referral'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      tint: colors.accentCoral,
      onPress: () => router.push('/notifications'),
    },
    {
      icon: 'information-circle-outline',
      label: 'About Baon',
      tint: colors.accentTeal,
      onPress: () => router.push('/about'),
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      tint: colors.textSecondary,
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'help-buoy-outline',
      label: 'Help & support',
      tint: colors.primary,
      onPress: () => router.push('/about'),
    },
    {
      icon: 'log-out-outline',
      label: 'Log out',
      tint: colors.danger,
      danger: true,
      onPress: () => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.replace('/');
      },
    },
  ];

  return (
    <Screen scroll>
      <Text style={[typo.display, styles.heading]}>Profile</Text>

      <Animated.View entering={FadeInDown.springify()}>
        <Card style={styles.identityCard}>
          <Avatar uri={user.avatarUrl} initials={user.initials} size={76} ring />
          <Text style={[typo.h1, styles.name]}>{user.fullName}</Text>
          <Text style={[typo.caption, styles.city]}>
            {user.city}, {user.region}
          </Text>
          <View style={styles.verifiedWrap}>
            <Pill label={verifiedLabel} icon="shield-checkmark" tone="teal" />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryMain}>
            <Text style={[typo.caption, styles.summaryLabel]}>Baon balance</Text>
            <View style={styles.summaryBalanceRow}>
              <Coin size={24} color={colors.primaryDark} />
              <Text style={styles.summaryBalance}>{formatPoints(balance)}</Text>
            </View>
          </View>
          <View style={styles.summarySplit}>
            <View style={styles.summaryStat}>
              <Text style={[typo.h2, styles.summaryEarned]}>+{formatPoints(earned)}</Text>
              <Text style={[typo.caption, styles.summaryStatLabel]}>Lifetime earned</Text>
            </View>
            <View style={styles.summaryVline} />
            <View style={styles.summaryStat}>
              <Text style={[typo.h2, styles.summaryRedeemed]}>−{formatPoints(redeemed)}</Text>
              <Text style={[typo.caption, styles.summaryStatLabel]}>Redeemed</Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      <View style={styles.menu}>
        {menu.map((item, i) => (
          <Animated.View key={item.label} entering={FadeInDown.delay(120 + i * 50).springify()}>
            <MenuRow item={item} />
          </Animated.View>
        ))}
      </View>

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={item.onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: item.tint }]}>
        <Ionicons name={item.icon} size={18} color={colors.surface} />
      </View>
      <Text style={[typo.body, styles.rowLabel, item.danger && styles.rowLabelDanger]}>
        {item.label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={item.danger ? colors.danger : colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: { marginTop: spacing.sm, marginBottom: spacing.lg },
  identityCard: { alignItems: 'center', paddingVertical: spacing.xl },
  name: { marginTop: spacing.md },
  city: { marginTop: 2 },
  verifiedWrap: { marginTop: spacing.md },
  summaryCard: { marginTop: spacing.lg, padding: spacing.lg },
  summaryMain: { alignItems: 'center' },
  summaryLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  summaryBalanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  summaryBalance: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryDark,
    marginLeft: spacing.sm,
  },
  summarySplit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryStat: { flex: 1, alignItems: 'center' },
  summaryVline: { width: 1, alignSelf: 'stretch', backgroundColor: colors.border },
  summaryEarned: { color: colors.success },
  summaryRedeemed: { color: colors.textPrimary },
  summaryStatLabel: { marginTop: 2 },
  menu: { marginTop: spacing.xl, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.soft,
  },
  rowPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontWeight: '600', marginLeft: spacing.md },
  rowLabelDanger: { color: colors.danger, fontWeight: '700' },
  bottomSpacer: { height: spacing.xxl },
});
