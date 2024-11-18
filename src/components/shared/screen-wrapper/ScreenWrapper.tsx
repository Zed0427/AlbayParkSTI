// src/components/ScreenWrapper.tsx
import React, { ReactNode } from "react";
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  ViewStyle,
} from "react-native";

interface ScreenWrapperProps {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  refreshing = false,
  onRefresh,
  contentContainerStyle = {},
}) => {
  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={<>{children}</>}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100, // Ensures bottom padding for all screens using this wrapper
  },
});

export default ScreenWrapper;