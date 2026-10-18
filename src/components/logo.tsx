import { Image } from 'expo-image';
import { StyleSheet, type StyleProp, type ImageStyle } from 'react-native';

const SOURCE = require('../../assets/images/baon-logo.png');

interface LogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

/** The Baon pouch mascot. Bundled asset — the one image the app does not fetch remotely. */
export function Logo({ size = 96, style }: LogoProps) {
  return (
    <Image
      source={SOURCE}
      style={[styles.base, { width: size, height: size }, style]}
      contentFit="contain"
      accessibilityLabel="Baon"
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: 'transparent' },
});
