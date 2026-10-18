import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Card, Coin, ConfirmSheet, EmptyState, Pill, SecondaryButton, SponsorChip } from '@/components';
import { formatPoints } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, spacing, type as typo } from '@/theme';
import type { TxKind } from '@/types';

type Tone = 'gold' | 'teal' | 'coral' | 'muted' | 'success' | 'danger';

const KIND_LABEL: Record<TxKind, string> = {
  claim: 'Daily claim',
  game: 'Game reward',
  redeem: 'Redemption',
  bonus: 'Bonus',
  referral: 'Referral',
};

const KIND_TONE: Record<TxKind, Tone> = {
  claim: 'gold',
  game: 'coral',
  redeem: 'teal',
  bonus: 'gold',
  referral: 'teal',
};

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

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions } = useBaon();
  const [reportOpen, setReportOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        <Header title="Transaction" onBack={() => router.back()} />
        <EmptyState
          icon="receipt-outline"
          title="Transaction not found"
          body="We couldn't find this entry. It may have been cleared from your history."
          actionLabel="Back to Wallet"
          onAction={() => router.replace('/(tabs)/wallet')}
        />
      </SafeAreaView>
    );
  }

  const earned = tx.amount >= 0;
  const amountColor = earned ? colors.success : colors.textPrimary;

  const copyCode = async (): Promise<void> => {
    if (!tx.code) return;
    await Clipboard.setStringAsync(tx.code);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <View style={styles.pad}>
        <Header title="Transaction" onBack={() => router.back()} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountBlock}>
          <View style={styles.amountRow}>
            <Coin size={30} />
            <Text style={[styles.amount, { color: amountColor }]}>
              {earned ? '+' : '−'}
              {formatPoints(Math.abs(tx.amount))}
            </Text>
          </View>
          <Text style={[typo.body, styles.txTitle]}>{tx.title}</Text>
          <View style={styles.pillWrap}>
            <Pill label={KIND_LABEL[tx.kind]} tone={KIND_TONE[tx.kind]} />
          </View>
        </View>

        <Card>
          <DetailRow label="Status" value={earned ? 'Points earned' : 'Points redeemed'} />
          <View style={styles.rowDivider} />
          <DetailRow label="Date" value={formatDateTime(tx.date)} />
          {tx.subtitle ? (
            <>
              <View style={styles.rowDivider} />
              <DetailRow label="Detail" value={tx.subtitle} />
            </>
          ) : null}
          {tx.sponsorId ? (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.sponsorRow}>
                <Text style={[typo.caption, styles.rowLabel]}>Sponsor</Text>
                <SponsorChip sponsorId={tx.sponsorId} size="sm" />
              </View>
            </>
          ) : null}
        </Card>

        {tx.code ? (
          <Card style={styles.codeCard}>
            <Text style={[typo.caption, styles.rowLabel]}>Redemption code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{tx.code}</Text>
              <Pressable onPress={copyCode} hitSlop={8} style={styles.copyBtn}>
                <Ionicons
                  name={copied ? 'checkmark-circle' : 'copy-outline'}
                  size={20}
                  color={copied ? colors.success : colors.accentTeal}
                />
              </Pressable>
            </View>
            {copied ? <Text style={[typo.caption, styles.copied]}>Copied ✓</Text> : null}
          </Card>
        ) : null}

        {reported ? (
          <View style={styles.reportedNote}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[typo.caption, styles.reportedText]}>
              Salamat! We got your report and will take a look.
            </Text>
          </View>
        ) : (
          <SecondaryButton
            label="Report a problem"
            icon="flag-outline"
            onPress={() => setReportOpen(true)}
            style={styles.report}
          />
        )}
      </View>

      <ConfirmSheet
        visible={reportOpen}
        title="Report this transaction?"
        body="Tell our team something looks off with this entry. We'll review it and get back to you."
        confirmLabel="Submit report"
        onConfirm={() => {
          setReportOpen(false);
          setReported(true);
        }}
        onCancel={() => setReportOpen(false)}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[typo.caption, styles.rowLabel]}>{label}</Text>
      <Text style={[typo.body, styles.rowValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  pad: { paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
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
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  amountBlock: { alignItems: 'center', marginBottom: spacing.xl },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  amount: { fontSize: 40, fontWeight: '800', marginLeft: spacing.md },
  txTitle: { marginTop: spacing.sm, color: colors.textSecondary },
  pillWrap: { marginTop: spacing.md },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  sponsorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowLabel: { textTransform: 'uppercase', letterSpacing: 1 },
  rowValue: { flex: 1, textAlign: 'right', marginLeft: spacing.md },
  rowDivider: { height: 1, backgroundColor: colors.border },
  codeCard: { marginTop: spacing.lg },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  codeText: { fontSize: 18, fontWeight: '800', letterSpacing: 1.5, color: colors.textPrimary },
  copyBtn: { padding: spacing.xs },
  copied: { color: colors.success, marginTop: spacing.xs, textAlign: 'right' },
  report: { marginTop: spacing.xl },
  reportedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportedText: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary },
});
