import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, PrimaryButton, Screen, SponsorChip } from '@/components';
import { rewards } from '@/data';
import { colors, radius, spacing, type as typo } from '@/theme';

const QR_SIZE = 21;

/** Deterministic QR-style matrix from the code string — pure, no Math.random. */
function buildMatrix(code: string): boolean[][] {
  let h = 2166136261;
  for (let i = 0; i < code.length; i += 1) {
    h ^= code.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = (h >>> 0) || 1;
  const rand = (): number => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };

  const n = QR_SIZE;
  const m: boolean[][] = [];
  for (let r = 0; r < n; r += 1) {
    const row: boolean[] = [];
    for (let c = 0; c < n; c += 1) row.push(rand() > 0.52);
    m.push(row);
  }

  const stampFinder = (top: number, left: number): void => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const border = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[top + r][left + c] = border || core;
      }
    }
  };
  stampFinder(0, 0);
  stampFinder(0, n - 7);
  stampFinder(n - 7, 0);

  // Quiet band separating the finders from the payload.
  for (let i = 0; i < 8; i += 1) {
    m[7][i] = false;
    m[i][7] = false;
    m[7][n - 1 - i] = false;
    m[i][n - 8] = false;
    m[n - 8][i] = false;
    m[n - 1 - i][7] = false;
  }
  return m;
}

function FauxQR({ code }: { code: string }) {
  const matrix = useMemo(() => buildMatrix(code), [code]);
  return (
    <View style={styles.qr}>
      {matrix.map((row, r) => (
        <View key={r} style={styles.qrRow}>
          {row.map((on, c) => (
            <View
              key={c}
              style={[styles.qrCell, { backgroundColor: on ? colors.textPrimary : colors.surface }]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const STEPS = [
  'Show this code or QR to the sponsor’s cashier or app.',
  'They scan or key in the code to apply your reward.',
  'Enjoy your baon — the points are already deducted.',
];

export default function RedeemReceiptScreen() {
  const { id, code } = useLocalSearchParams<{ id: string; code: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const reward = rewards.find((r) => r.id === id);
  const redeemCode = code ?? 'BAON-XXXX-XXXX';

  const copy = async (): Promise<void> => {
    await Clipboard.setStringAsync(redeemCode);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.springify()} style={styles.hero}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={44} color={colors.surface} />
        </View>
        <Text style={[typo.display, styles.redeemed]}>Redeemed!</Text>
        <Text style={[typo.body, styles.rewardTitle]}>{reward ? reward.title : 'Your reward'}</Text>
        {reward ? (
          <View style={styles.chipWrap}>
            <SponsorChip sponsorId={reward.sponsorId} size="md" />
          </View>
        ) : null}
      </Animated.View>

      <Card style={styles.codeCard}>
        <Text style={[typo.caption, styles.codeLabel]}>Your redemption code</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{redeemCode}</Text>
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

        <FauxQR code={redeemCode} />

        <View style={styles.expiryRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[typo.caption, styles.expiry]}>Use before Aug 9, 2026</Text>
        </View>
      </Card>

      <Text style={[typo.h2, styles.stepsTitle]}>How to use it</Text>
      {STEPS.map((s, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{i + 1}</Text>
          </View>
          <Text style={[typo.body, styles.stepText]}>{s}</Text>
        </View>
      ))}

      <PrimaryButton
        label="Done"
        icon="wallet"
        onPress={() => router.replace('/(tabs)/wallet')}
        style={styles.done}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.xl },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  redeemed: { color: colors.textPrimary },
  rewardTitle: { marginTop: spacing.xs, color: colors.textSecondary },
  chipWrap: { marginTop: spacing.md },
  codeCard: { alignItems: 'center' },
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
  codeText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  copyText: { color: colors.accentTeal, fontWeight: '700', marginLeft: spacing.xs + 2 },
  copyDone: { color: colors.success },
  qr: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrRow: { flexDirection: 'row' },
  qrCell: { width: 9, height: 9 },
  expiryRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  expiry: { marginLeft: spacing.xs + 2 },
  stepsTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: colors.surface, fontWeight: '800', fontSize: 13 },
  stepText: { flex: 1, marginLeft: spacing.md },
  done: { marginTop: spacing.xl },
});
