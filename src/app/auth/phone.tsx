import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, Screen } from '@/components';
import { colors, radius, spacing, type as typo } from '@/theme';

/** "9171234567" -> "917 123 4567" */
function formatMobile(digits: string): string {
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  return [a, b, c].filter(Boolean).join(' ');
}

export default function Phone() {
  const [digits, setDigits] = useState('');
  const complete = digits.length === 10;

  const handleChange = (text: string) => {
    setDigits(text.replace(/\D/g, '').slice(0, 10));
  };

  const handleContinue = () => {
    router.push(`/auth/otp?mobile=${digits}`);
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.springify()}>
          <Text style={styles.title}>What’s your mobile number?</Text>
          <Text style={styles.sub}>We’ll text a 6-digit code to verify it’s you.</Text>

          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>+63</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formatMobile(digits)}
              onChangeText={handleChange}
              keyboardType="number-pad"
              placeholder="917 123 4567"
              placeholderTextColor={colors.textSecondary}
              maxLength={12}
              autoFocus
            />
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          icon="arrow-forward"
          disabled={!complete}
          onPress={handleContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center' },
  title: { ...typo.display, fontSize: 26 },
  sub: { ...typo.body, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.xl },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prefix: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  prefixText: { ...typo.h2 },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  footer: { paddingBottom: spacing.lg },
});
