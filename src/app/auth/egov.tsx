import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Card, PrimaryButton, Screen } from '@/components';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, spacing, type as typo } from '@/theme';

type Phase = 'idle' | 'verifying' | 'verified';

const VERIFY_MS = 1200;

export default function Egov() {
  const { user, setVerification } = useBaon();
  const [phase, setPhase] = useState<Phase>('idle');

  const startVerify = () => {
    setPhase('verifying');
    setTimeout(() => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhase('verified');
    }, VERIFY_MS);
  };

  const enter = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setVerification('egovph');
    router.replace('/(tabs)');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.springify()}>
          <View style={styles.flagStrip}>
            <View style={[styles.flagDot, { backgroundColor: colors.accentTeal }]} />
            <Text style={styles.flagText}>Republic of the Philippines</Text>
          </View>

          <Card style={styles.sheet}>
            <View style={styles.seal}>
              <Ionicons name="shield-checkmark" size={34} color={colors.accentTeal} />
            </View>
            <Text style={styles.brand}>eGovPH</Text>
            <Text style={styles.brandSub}>National ID verification</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <Text style={styles.value}>{user.fullName}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>National ID</Text>
              <Text style={styles.value}>{'•••• •••• •••• 4821'}</Text>
            </View>

            {phase === 'verified' ? (
              <Animated.View entering={FadeIn} style={styles.status}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>Verified</Text>
              </Animated.View>
            ) : phase === 'verifying' ? (
              <View style={styles.status}>
                <ActivityIndicator color={colors.accentTeal} />
                <Text style={styles.statusText}>Verifying with eGovPH…</Text>
              </View>
            ) : null}
          </Card>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        {phase === 'verified' ? (
          <PrimaryButton label="Enter Baon" icon="arrow-forward" onPress={enter} />
        ) : (
          <PrimaryButton
            label="Continue with eGovPH"
            icon="shield-checkmark"
            loading={phase === 'verifying'}
            onPress={startVerify}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center' },
  flagStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  flagDot: { width: 8, height: 8, borderRadius: radius.pill },
  flagText: { ...typo.caption, color: colors.accentTeal, fontWeight: '700', letterSpacing: 0.3 },
  sheet: { alignItems: 'center', paddingVertical: spacing.xl },
  seal: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: '#E3F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: { ...typo.h1, color: colors.accentTeal },
  brandSub: { ...typo.caption, marginTop: 2, marginBottom: spacing.lg },
  field: { alignSelf: 'stretch', marginTop: spacing.md },
  label: { ...typo.caption, textTransform: 'uppercase', letterSpacing: 0.4 },
  value: { ...typo.h2, marginTop: spacing.xs },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  statusText: { ...typo.body, color: colors.textSecondary, fontWeight: '600' },
  footer: { paddingBottom: spacing.lg },
});
