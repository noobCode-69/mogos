import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui, TamaguiProvider } from "@tamagui/core";
import "@tamagui/native/setup-zeego";
const config = createTamagui(defaultConfig);

const queryClient = new QueryClient();

function AuthGate() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthGate />
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
