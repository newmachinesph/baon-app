import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, Logo, Screen, SponsorChip } from '@/components';
import { colors, radius, spacing, type as typo } from '@/theme';
import type { IconName, SponsorId } from '@/types';

const PILLARS: { icon: IconName; tint: string; title: string; body: string }[] = [
  {
    icon: 'sync',
    tint: colors.accentTeal,
    title: 'Closed-loop',
    body: 'Points only exchange for goods — load, data, food, vouchers. Never for pesos.',
  },
  {
    icon: 'cash-outline',
    tint: colors.primary,
    title: 'No cash-out',
    body: 'You can’t withdraw Baon points as money. There is nothing to cash out.',
  },
  {
    icon: 'shield-checkmark',
    tint: colors.accentCoral,
    title: 'Not crypto',
    body: 'No coins, no wallet keys, no blockchain. Just simple sponsor-funded rewards.',
  },
];

const STRIP: SponsorId[] = ['globe', 'smart', 'jollibee', 'puregold', 'grab', 'shopee'];

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

export default function AboutScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <Header title="About Baon" onBack={() => router.back()} />

      <View style={styles.logoWrap}>
        <Logo size={96} />
      </View>

      <Text style={[typo.h2, styles.qTitle]}>What is Baon?</Text>
      <Text style={[typo.body, styles.body]}>
        “Baon” is the small daily allowance a parent gives — for the trip to school, for merienda.
        Baon the app is that same idea: a little something every day. Play a quick game, earn points,
        and exchange them for real load, data, and treats.
      </Text>

      <Text style={[typo.h2, styles.qTitle]}>How is it free?</Text>
      <Text style={[typo.body, styles.body]}>
        Sponsors fund the points pool. In return they get your attention and reach — a friendly way
        for brands to reward everyday Filipinos. You never pay, and you never owe anything.
      </Text>

      <View style={styles.pillars}>
        {PILLARS.map((p) => (
          <Card key={p.title} style={styles.pillar}>
            <View style={[styles.pillarIcon, { backgroundColor: p.tint }]}>
              <Ionicons name={p.icon} size={22} color={colors.surface} />
            </View>
            <View style={styles.pillarBody}>
              <Text style={[typo.body, styles.pillarTitle]}>{p.title}</Text>
              <Text style={[typo.caption, styles.pillarText]}>{p.body}</Text>
            </View>
          </Card>
        ))}
      </View>

      <Text style={[typo.h2, styles.qTitle]}>Our sponsors</Text>
      <View style={styles.strip}>
        {STRIP.map((id) => (
          <View key={id} style={styles.stripItem}>
            <SponsorChip sponsorId={id} size="md" />
          </View>
        ))}
      </View>

      <Text style={[typo.caption, styles.footer]}>Baon 1.0.0 • Made in the Philippines 🇵🇭</Text>
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
  logoWrap: { alignItems: 'center', paddingVertical: spacing.lg },
  qTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  body: { color: colors.textSecondary, lineHeight: 22 },
  pillars: { marginTop: spacing.lg },
  pillar: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  pillarIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarBody: { flex: 1, marginLeft: spacing.md },
  pillarTitle: { fontWeight: '700' },
  pillarText: { marginTop: 2, lineHeight: 18 },
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  stripItem: { marginRight: spacing.sm, marginBottom: spacing.sm },
  footer: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
  },
});
