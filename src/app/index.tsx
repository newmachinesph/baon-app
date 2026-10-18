import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Logo } from '@/components';
import { colors, spacing, type as typo } from '@/theme';

const SPLASH_MS = 1400;

export default function Splash() {
  const scale = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 9, stiffness: 120 });
    const id = setTimeout(() => router.replace('/onboarding'), SPLASH_MS);
    return () => clearTimeout(id);
  }, [scale]);

  const coinStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <LinearGradient
      colors={[colors.primarySoft, colors.background]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.fill}
    >
      <View style={styles.center}>
        <Animated.View style={coinStyle}>
          <Logo size={148} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.words}>
          <Text style={styles.wordmark}>Baon</Text>
          <Text style={styles.tagline}>Konting baon, araw-araw.</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  words: { alignItems: 'center', marginTop: spacing.xl },
  wordmark: { ...typo.display, fontSize: 40, color: colors.primaryDark },
  tagline: { ...typo.body, color: colors.textSecondary, marginTop: spacing.xs },
});
