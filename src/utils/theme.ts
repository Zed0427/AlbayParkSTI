// src/utils/theme.ts
import { MD3LightTheme as DefaultTheme, MD3Theme } from "react-native-paper";

// Define a custom theme compatible with MD3Theme
const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4CAF50",
    secondary: "#FFC107", // Use `secondary` instead of `accent`
    background: "#F4F4F4",
    surface: "#FFFFFF",
    error: "#D32F2F",
    onPrimary: "#FFFFFF",
    onSecondary: "#000000",
    primaryContainer: "#A5D6A7",
    secondaryContainer: "#FFE082",
    tertiary: "#B39DDB",
  },
  fonts: {
    ...DefaultTheme.fonts,
    // Each MD3 font type requires additional properties
    bodyLarge: {
      fontFamily: "Roboto-Regular",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    titleMedium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500",
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0.15,
    },
    labelSmall: {
      fontFamily: "Roboto-Light",
      fontWeight: "300",
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    headlineSmall: {
      fontFamily: "Roboto-Thin",
      fontWeight: "100",
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: 0,
    },
  },
  isV3: true, // Ensure this is set to true for MD3 compatibility
};

export default theme;
