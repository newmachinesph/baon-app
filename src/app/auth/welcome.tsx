import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Logo, PrimaryButton, Screen, SecondaryButton } from '@/components';
import { colors, spacing, type as typo } from '@/theme';

export default function Welcome() {
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.springify()} style={styles.head}>
          <Logo size={116} />
          <Text style={styles.wordmark}>Baon</Text>
          <Text style={styles.title}>Sign in to claim your baon</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.actions}>
          <PrimaryButton
            label="Sign in with eGovPH"
            icon="shield-checkmark"
            onPress={() => router.push('/auth/egov')}
          />
          <SecondaryButton
            label="Continue with mobile number"
            icon="phone-portrait"
            onPress={() => router.push('/auth/phone')}
            style={styles.secondary}
          />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(240).springify()} style={styles.footer}>
        <Text style={styles.note}>
          Baon points are funded by our sponsors. No load-up, no cash-out.
        </Text>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center' },
  head: { alignItems: 'center', marginBottom: spacing.xxl },
  wordmark: { ...typo.display, fontSize: 36, color: colors.primaryDark, marginTop: spacing.lg },
  title: { ...typo.body, color: colors.textSecondary, marginTop: spacing.xs },
  actions: { gap: spacing.md },
  secondary: { marginTop: spacing.xs },
  footer: { alignItems: 'center', paddingBottom: spacing.lg, gap: spacing.md },
  note: {
    ...typo.caption,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
});
