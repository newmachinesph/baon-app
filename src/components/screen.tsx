import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  padded?: boolean;
  edges?: ('top' | 'bottom')[];
}

export function Screen({
  children,
  scroll = false,
  refreshing = false,
  onRefresh,
  padded = true,
  edges = ['top'],
}: ScreenProps) {
  const gutter = padded ? styles.gutter : undefined;

  return (
    <SafeAreaView style={styles.flex} edges={edges as Edge[]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, gutter]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, gutter]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  gutter: { paddingHorizontal: spacing.lg },
  scrollContent: { paddingBottom: spacing.xxl, flexGrow: 1 },
});
