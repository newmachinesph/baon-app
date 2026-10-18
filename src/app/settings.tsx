import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, ConfirmSheet, Pill, Screen } from '@/components';
import { colors, radius, spacing, type as typo } from '@/theme';
import type { IconName } from '@/types';

type ToggleKey = 'reminder' | 'streak' | 'offers' | 'haptics';

const TOGGLES: { key: ToggleKey; icon: IconName; label: string; hint: string }[] = [
  { key: 'reminder', icon: 'alarm', label: 'Daily reminder', hint: 'Nudge me to claim my baon' },
  { key: 'streak', icon: 'flame', label: 'Streak alerts', hint: 'Warn me before my streak resets' },
  { key: 'offers', icon: 'megaphone', label: 'Sponsor offers', hint: 'New rewards and promos' },
  { key: 'haptics', icon: 'phone-portrait', label: 'Haptics', hint: 'Vibration feedback on taps' },
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

export default function SettingsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    reminder: true,
    streak: true,
    offers: false,
    haptics: true,
  });
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const setToggle = (key: ToggleKey, value: boolean): void => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Screen scroll>
      <Header title="Settings" onBack={() => router.back()} />

      <Text style={[typo.caption, styles.groupLabel]}>Notifications</Text>
      <Card style={styles.group}>
        {TOGGLES.map((t, i) => (
          <View key={t.key} style={[styles.row, i > 0 && styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons name={t.icon} size={20} color={colors.primaryDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={[typo.body, styles.rowLabel]}>{t.label}</Text>
              <Text style={[typo.caption, styles.rowHint]}>{t.hint}</Text>
            </View>
            <Switch
              value={toggles[t.key]}
              onValueChange={(v) => setToggle(t.key, v)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        ))}
      </Card>

      <Text style={[typo.caption, styles.groupLabel]}>Language</Text>
      <Card style={styles.group}>
        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Ionicons name="language" size={20} color={colors.primaryDark} />
          </View>
          <View style={styles.rowBody}>
            <Text style={[typo.body, styles.rowLabel]}>App language</Text>
          </View>
          <View style={styles.langRow}>
            <Pill
              label="English"
              tone="teal"
              selected={language === 'en'}
              onPress={() => setLanguage('en')}
            />
            <View style={styles.langGap} />
            <Pill
              label="Filipino"
              tone="teal"
              selected={language === 'fil'}
              onPress={() => setLanguage('fil')}
            />
          </View>
        </View>
      </Card>

      <Text style={[typo.caption, styles.groupLabel]}>Account</Text>
      <Card style={styles.group}>
        <Pressable onPress={() => setDeleteOpen(true)} style={styles.row}>
          <View style={[styles.rowIcon, styles.dangerIcon]}>
            <Ionicons name="trash" size={20} color={colors.danger} />
          </View>
          <View style={styles.rowBody}>
            <Text style={[typo.body, styles.dangerLabel]}>Delete account</Text>
            <Text style={[typo.caption, styles.rowHint]}>Remove your data from Baon</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      </Card>

      {deleted ? (
        <View style={styles.deletedNote}>
          <Ionicons name="information-circle" size={18} color={colors.accentTeal} />
          <Text style={[typo.caption, styles.deletedText]}>
            This is a demo — no account was actually deleted.
          </Text>
        </View>
      ) : null}

      <Text style={[typo.caption, styles.version]}>App version 1.0.0 (demo)</Text>

      <ConfirmSheet
        visible={deleteOpen}
        title="Delete your account?"
        body="This would permanently remove your Baon points, streak, and history. This can't be undone."
        confirmLabel="Delete account"
        destructive
        onConfirm={() => {
          setDeleteOpen(false);
          setDeleted(true);
        }}
        onCancel={() => setDeleteOpen(false)}
      />
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
  groupLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  group: { padding: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  dangerIcon: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.danger },
  rowBody: { flex: 1, marginLeft: spacing.md },
  rowLabel: { fontWeight: '600' },
  rowHint: { marginTop: 1 },
  dangerLabel: { fontWeight: '700', color: colors.danger },
  langRow: { flexDirection: 'row', alignItems: 'center' },
  langGap: { width: spacing.sm },
  deletedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deletedText: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary },
  version: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
  },
});
