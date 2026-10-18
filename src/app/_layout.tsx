import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BaonProvider } from '@/context/BaonProvider';
import { colors } from '@/theme';

const MODAL = { presentation: 'modal' as const };

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BaonProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="notifications" options={MODAL} />
          <Stack.Screen name="referral" options={MODAL} />
          <Stack.Screen name="settings" options={MODAL} />
          <Stack.Screen name="about" options={MODAL} />
          <Stack.Screen name="identity" options={MODAL} />
          <Stack.Screen name="redeem/[id]" options={MODAL} />
          <Stack.Screen name="game/result" options={MODAL} />
        </Stack>
      </BaonProvider>
    </SafeAreaProvider>
  );
}
