import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { PrimaryButton, Screen } from '@/components';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, spacing, type as typo } from '@/theme';

type Phase = 'ready' | 'scanning' | 'verified';

const SCAN_MS = 1200;

export default function Verify() {
  const { setVerification } = useBaon();
  const [phase, setPhase] = useState<Phase>('ready');
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (phase === 'scanning') {
      pulse.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
      const id = setTimeout(() => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPhase('verified');
      }, SCAN_MS);
      return () => clearTimeout(id);
    }
    pulse.value = 0;
  }, [phase, pulse]);

  const ringStyle = useAnimatedStyle(() => ({ opacity: 0.35 + pulse.value * 0.65 }));

  const enter = () => {
    setVerification('mobile');
    router.replace('/(tabs)');
  };

  const frameColor =
    phase === 'verified' ? colors.success : phase === 'scanning' ? colors.primary : colors.border;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>
          {phase === 'verified' ? 'Verified' : 'Center your face'}
        </Text>
        <Text style={styles.sub}>
          {phase === 'verified'
            ? 'Salamat! Your identity is confirmed.'
            : 'A quick liveness check keeps your baon yours.'}
        </Text>

        <View style={styles.frameWrap}>
          <Animated.View style={[styles.ring, { borderColor: frameColor }, ringStyle]} />
          <View style={styles.face}>
            <Ionicons
              name={phase === 'verified' ? 'checkmark' : 'person'}
              size={92}
              color={phase === 'verified' ? colors.success : colors.textSecondary}
            />
          </View>
        </View>

        {phase === 'scanning' ? (
          <Animated.Text entering={FadeIn} style={styles.scanning}>
            Scanning…
          </Animated.Text>
        ) : (
          <View style={styles.scanSpacer} />
        )}
      </View>

      <View style={styles.footer}>
        {phase === 'verified' ? (
          <PrimaryButton label="Enter Baon" icon="arrow-forward" onPress={enter} />
        ) : (
          <PrimaryButton
            label="Capture"
            icon="scan"
            loading={phase === 'scanning'}
            onPress={() => setPhase('scanning')}
          />
        )}
      </View>
    </Screen>
  );
}

const FRAME = 220;

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typo.display, fontSize: 26, textAlign: 'center' },
  sub: {
    ...typo.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  frameWrap: { width: FRAME, height: FRAME, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: FRAME,
    height: FRAME,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  face: {
    width: FRAME - 28,
    height: FRAME - 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanning: { ...typo.body, color: colors.primaryDark, fontWeight: '700', marginTop: spacing.xl },
  scanSpacer: { height: spacing.xl + 20 },
  footer: { paddingBottom: spacing.lg },
});
