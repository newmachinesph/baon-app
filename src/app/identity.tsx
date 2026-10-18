import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Card, Screen, SecondaryButton } from '@/components';
import { useBaon } from '@/context/BaonProvider';
import { colors, spacing, type as typo } from '@/theme';

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

function CheckRow({ label, done, hint }: { label: string; done: boolean; hint?: string }) {
  return (
    <View style={styles.checkRow}>
      <Ionicons
        name={done ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={done ? colors.success : colors.textSecondary}
      />
      <Text style={[typo.body, styles.checkLabel]}>{label}</Text>
      <Text style={[typo.caption, done ? styles.checkDone : styles.checkPending]}>
        {done ? 'Verified' : hint ?? 'Not linked'}
      </Text>
    </View>
  );
}

export default function IdentityScreen() {
  const router = useRouter();
  const { user, setVerification } = useBaon();
  const isGov = user.verifiedWith === 'egovph';

  const linkGov = (): void => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setVerification('egovph');
  };

  return (
    <Screen scroll>
      <Header title="Identity" onBack={() => router.back()} />

      <View style={styles.hero}>
        <View style={[styles.shield, isGov ? styles.shieldGov : styles.shieldMobile]}>
          <Ionicons
            name={isGov ? 'shield-checkmark' : 'phone-portrait'}
            size={44}
            color={colors.surface}
          />
        </View>
        <Text style={[typo.h1, styles.status]}>{isGov ? 'Verified' : 'Mobile verified'}</Text>
        <Text style={[typo.body, styles.statusSub]}>
          {isGov ? 'National ID • Verified via eGovPH' : 'Verified with your mobile number'}
        </Text>
      </View>

      <Card style={styles.group}>
        <CheckRow label="Mobile number" done />
        <View style={styles.divider} />
        <CheckRow label="Selfie check" done />
        <View style={styles.divider} />
        <CheckRow label="National ID" done={isGov} hint="Not linked" />
      </Card>

      {!isGov ? (
        <SecondaryButton
          label="Link with eGovPH"
          icon="shield-checkmark"
          onPress={linkGov}
          style={styles.linkBtn}
        />
      ) : null}

      <Card style={styles.whyCard}>
        <Text style={[typo.h2, styles.whyTitle]}>Why we verify</Text>
        <Text style={[typo.body, styles.whyText]}>
          Verification keeps Baon fair: one account per person, so daily rewards go to real people
          and not to bots. Your ID is used only to confirm it’s really you — nothing more.
        </Text>
      </Card>
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
  hero: { alignItems: 'center', paddingVertical: spacing.xl },
  shield: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  shieldGov: { backgroundColor: colors.accentTeal },
  shieldMobile: { backgroundColor: colors.primary },
  status: { color: colors.textPrimary },
  statusSub: { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
  group: { padding: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2 },
  checkLabel: { flex: 1, marginLeft: spacing.md, fontWeight: '600' },
  checkDone: { color: colors.success, fontWeight: '700' },
  checkPending: { color: colors.textSecondary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border },
  linkBtn: { marginTop: spacing.lg },
  whyCard: { marginTop: spacing.lg, backgroundColor: colors.background },
  whyTitle: { marginBottom: spacing.sm },
  whyText: { color: colors.textSecondary, lineHeight: 21 },
});
