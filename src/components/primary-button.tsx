import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import type { IconName } from '@/types';

const GOLD_GRADIENT = [colors.primary, colors.primaryDark] as const;

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  /** Use on gold surfaces, where the default gold gradient would disappear into the background. */
  variant?: 'gold' | 'contrast';
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
  style,
  variant = 'gold',
}: PrimaryButtonProps) {
  const blocked = Boolean(disabled) || Boolean(loading);
  const muted = Boolean(disabled) && !loading;
  const contrast = variant === 'contrast';

  const gradient: readonly [string, string] = muted
    ? [colors.primarySoft, colors.primarySoft]
    : contrast
      ? [colors.surface, colors.surface]
      : GOLD_GRADIENT;

  const tint = muted
    ? colors.textSecondary
    : contrast
      ? colors.primaryDark
      : colors.surface;

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={blocked}
      style={({ pressed }) => [
        styles.wrap,
        !muted && shadow.soft,
        pressed && !blocked && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inner}
      >
        {loading ? (
          <ActivityIndicator color={tint} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={18} color={tint} style={styles.icon} /> : null}
            <Text style={[typo.body, styles.label, { color: tint }]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.button, overflow: 'hidden' },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
  },
  label: { fontWeight: '700' },
  icon: { marginRight: spacing.sm },
  pressed: { transform: [{ scale: 0.97 }] },
});
