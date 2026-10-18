import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface CoinProps {
  size?: number;
  /** The disc. */
  color?: string;
  /** The sun inside the disc. Must contrast with `color` — a white coin needs a gold sun. */
  glyph?: string;
}

/** Baon's points mark — a sun-coin glyph. Appears anywhere points are shown. */
export function Coin({ size = 20, color = colors.primary, glyph = colors.surface }: CoinProps) {
  return (
    <View
      style={[
        styles.coin,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Ionicons name="sunny" size={size * 0.64} color={glyph} />
    </View>
  );
}

const styles = StyleSheet.create({
  coin: { alignItems: 'center', justifyContent: 'center' },
});
