import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';
import { PrimaryButton } from './primary-button';
import { SecondaryButton } from './secondary-button';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export function ConfirmSheet({
  visible,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  destructive = false,
  disabled = false,
}: ConfirmSheetProps) {
  const handleConfirm = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={[typo.h1, styles.title]}>{title}</Text>
          <Text style={[typo.body, styles.body]}>{body}</Text>

          {destructive ? (
            <Pressable
              onPress={handleConfirm}
              disabled={disabled}
              style={({ pressed }) => [
                styles.danger,
                disabled && styles.dangerDisabled,
                pressed && !disabled && styles.pressed,
              ]}
            >
              <Text style={[typo.body, styles.dangerLabel]}>{confirmLabel}</Text>
            </Pressable>
          ) : (
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              disabled={disabled}
              style={styles.stretch}
            />
          )}

          <SecondaryButton label="Cancel" onPress={onCancel} style={styles.cancel} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ponytail: modal scrim needs an alpha the token palette doesn't define.
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(43, 38, 32, 0.45)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card + 6,
    borderTopRightRadius: radius.card + 6,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    ...shadow.lifted,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: { textAlign: 'center' },
  body: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  stretch: { alignSelf: 'stretch' },
  danger: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    borderRadius: radius.button,
    backgroundColor: colors.danger,
    ...shadow.soft,
  },
  dangerDisabled: { opacity: 0.5 },
  dangerLabel: { color: colors.surface, fontWeight: '700' },
  pressed: { transform: [{ scale: 0.97 }] },
  cancel: { alignSelf: 'stretch', marginTop: spacing.sm },
});
