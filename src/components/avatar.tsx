import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme';

interface AvatarProps {
  uri?: string;
  initials: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ uri, initials, size = 44, ring = false }: AvatarProps) {
  const inner = size - (ring ? 6 : 0);

  const face = uri ? (
    <Image
      source={{ uri }}
      style={{ width: inner, height: inner, borderRadius: inner / 2 }}
      contentFit="cover"
      transition={200}
    />
  ) : (
    <View
      style={[
        styles.fallback,
        { width: inner, height: inner, borderRadius: inner / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: inner * 0.4 }]}>{initials}</Text>
    </View>
  );

  if (ring) {
    return (
      <View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {face}
      </View>
    );
  }
  return face;
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accentTeal,
    backgroundColor: colors.surface,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  initials: { color: colors.primaryDark, fontWeight: '700' },
});
