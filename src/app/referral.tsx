import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Card, Coin, PrimaryButton, Screen } from '@/components';
import { referralCode } from '@/data';
import { photo } from '@/data/images';
import { colors, radius, spacing, type as typo } from '@/theme';

const STEPS: { icon: 'share-social' | 'person-add' | 'gift'; title: string; body: string }[] = [
  { icon: 'share-social', title: 'Share your code', body: 'Send your code to family and friends.' },
  { icon: 'person-add', title: 'They join Baon', body: 'They sign up and verify with your code.' },
  { icon: 'gift', title: 'You both get baon', body: 'Each of you earns 500 points. Sulit!' },
];

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

export default function ReferralScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    await Clipboard.setStringAsync(referralCode);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = async (): Promise<void> => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Share.share({
      message: `Join me on Baon and get free daily baon! Use my code ${referralCode} when you sign up. We both get 500 points.`,
    });
  };

  return (
    <Screen scroll>
      <Header title="Invite friends" onBack={() => router.back()} />

      <Image source={{ uri: photo('baon-referral', 640, 360) }} style={styles.hero} contentFit="cover" transition={200} />

      <Text style={[typo.display, styles.title]}>Bigyan mo sila ng baon</Text>
      <Text style={[typo.body, styles.subtitle]}>
        Invite friends and family. You both get 500 points when they verify.
      </Text>

      <Card style={styles.codeCard}>
        <Text style={[typo.caption, styles.codeLabel]}>Your referral code</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{referralCode}</Text>
        </View>
        <Pressable onPress={copy} hitSlop={8} style={styles.copyBtn}>
          <Ionicons
            name={copied ? 'checkmark-circle' : 'copy-outline'}
            size={18}
            color={copied ? colors.success : colors.accentTeal}
          />
          <Text style={[typo.caption, styles.copyText, copied && styles.copyDone]}>
            {copied ? 'Copied ✓' : 'Copy code'}
          </Text>
        </Pressable>
      </Card>

      <PrimaryButton label="Share invite" icon="share-social" onPress={share} style={styles.share} />

      <View style={styles.statCard}>
        <View style={styles.statVal}>
          <Coin size={22} />
          <Text style={styles.statNumber}>3</Text>
        </View>
        <Text style={[typo.caption, styles.statLabel]}>Friends joined with your code</Text>
      </View>

      <Text style={[typo.h2, styles.stepsTitle]}>How it works</Text>
      {STEPS.map((s, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.stepIcon}>
            <Ionicons name={s.icon} size={20} color={colors.accentTeal} />
          </View>
          <View style={styles.stepBody}>
            <Text style={[typo.body, styles.stepTitle]}>{s.title}</Text>
            <Text style={[typo.caption, styles.stepText]}>{s.body}</Text>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, marginBottom: spacing.sm },
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
  hero: { width: '100%', height: 180, borderRadius: radius.card, backgroundColor: colors.primarySoft },
  title: { marginTop: spacing.lg, fontSize: 24 },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs },
  codeCard: { alignItems: 'center', marginTop: spacing.lg },
  codeLabel: { textTransform: 'uppercase', letterSpacing: 1 },
  codeBox: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  codeText: { fontSize: 22, fontWeight: '800', letterSpacing: 2, color: colors.textPrimary },
  copyBtn: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingVertical: spacing.xs },
  copyText: { color: colors.accentTeal, fontWeight: '700', marginLeft: spacing.xs + 2 },
  copyDone: { color: colors.success },
  share: { marginTop: spacing.lg },
  statCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
  },
  statVal: { flexDirection: 'row', alignItems: 'center' },
  statNumber: { ...typo.display, marginLeft: spacing.sm, color: colors.primaryDark },
  statLabel: { marginTop: spacing.xs, color: colors.textSecondary },
  stepsTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBody: { flex: 1, marginLeft: spacing.md },
  stepTitle: { fontWeight: '700' },
  stepText: { marginTop: 2 },
});
