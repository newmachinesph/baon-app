import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components';
import { colors, radius, spacing, type as typo } from '@/theme';

const CELLS = 6;
const RESEND_SECONDS = 30;

function maskMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 10) return '+63 ••• ••• ••••';
  return `+63 ${digits.slice(0, 3)} ••• ${digits.slice(6)}`;
}

export default function Otp() {
  const { mobile } = useLocalSearchParams<{ mobile?: string }>();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  useEffect(() => {
    if (code.length === CELLS) {
      const id = setTimeout(() => router.push('/auth/verify'), 180);
      return () => clearTimeout(id);
    }
  }, [code]);

  const handleChange = (text: string) => {
    setCode(text.replace(/\D/g, '').slice(0, CELLS));
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.springify()}>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.sub}>
            Sent to <Text style={styles.mobile}>{maskMobile(mobile ?? '')}</Text>
          </Text>

          <Pressable style={styles.cells} onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: CELLS }).map((_, i) => {
              const active = i === code.length;
              const filled = i < code.length;
              return (
                <View
                  key={i}
                  style={[styles.cell, filled && styles.cellFilled, active && styles.cellActive]}
                >
                  <Text style={styles.cellText}>{code[i] ?? ''}</Text>
                </View>
              );
            })}
          </Pressable>

          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={CELLS}
            autoFocus
            caretHidden
          />

          {seconds > 0 ? (
            <Text style={styles.resend}>Resend in 0:{String(seconds).padStart(2, '0')}</Text>
          ) : (
            <Pressable hitSlop={12} onPress={() => setSeconds(RESEND_SECONDS)}>
              <Text style={[styles.resend, styles.resendActive]}>Resend code</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center' },
  title: { ...typo.display, fontSize: 26, textAlign: 'center' },
  sub: { ...typo.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  mobile: { color: colors.textPrimary, fontWeight: '700' },
  cells: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  cell: {
    width: 46,
    height: 56,
    borderRadius: radius.button,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: { borderColor: colors.primary },
  cellActive: { borderColor: colors.primaryDark, backgroundColor: colors.primarySoft },
  cellText: { ...typo.display, fontSize: 24 },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  resend: { ...typo.caption, textAlign: 'center', marginTop: spacing.xxl },
  resendActive: { color: colors.primaryDark, fontWeight: '700' },
});
