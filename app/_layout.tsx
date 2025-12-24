
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert, View } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useBanCheck } from "@/hooks/useBanCheck";
import BanScreen from "@/components/BanScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(auth)/welcome",
};

function RootLayoutNav() {
  const { isDark } = useTheme();
  const networkState = useNetworkState();
  const { isAuthenticated, isLoading } = useAuth();
  const { isChecking, hasFullBan, getFullBan } = useBanCheck();

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 Sie sind offline",
        "Sie können die App weiterhin nutzen! Ihre Änderungen werden lokal gespeichert und synchronisiert, wenn Sie wieder online sind."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  React.useEffect(() => {
    if (!isLoading && !isChecking) {
      if (isAuthenticated) {
        if (!hasFullBan) {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(auth)/welcome');
      }
    }
  }, [isAuthenticated, isLoading, isChecking, hasFullBan]);

  // Show ban screen if user has full ban
  if (isAuthenticated && hasFullBan) {
    const ban = getFullBan();
    if (ban) {
      return <BanScreen ban={ban} />;
    }
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 217, 95)",
      background: "rgb(255, 255, 255)",
      card: "rgb(249, 250, 251)",
      text: "rgb(26, 26, 26)",
      border: "rgb(229, 231, 235)",
      notification: "rgb(255, 107, 53)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    dark: true,
    colors: {
      primary: "rgb(0, 217, 95)",
      background: "rgb(15, 23, 42)",
      card: "rgb(30, 41, 59)",
      text: "rgb(241, 245, 249)",
      border: "rgb(51, 65, 85)",
      notification: "rgb(255, 107, 53)",
    },
  };

  return (
    <NavigationThemeProvider
      value={isDark ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Standard Modal",
          }}
        />
        <Stack.Screen
          name="formsheet"
          options={{
            presentation: "formSheet",
            title: "Form Sheet Modal",
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.5, 0.8, 1.0],
            sheetCornerRadius: 20,
          }}
        />
        <Stack.Screen
          name="transparent-modal"
          options={{
            presentation: "transparentModal",
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} animated />
      <SystemBars style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <WidgetProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
