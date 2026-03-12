import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { supabase } from "../lib/supabase";
const redirectTo = makeRedirectUri();

async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    Alert.alert("Error", "Could not start Google sign in.");
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success") return;

  const url = new URL(result.url);
  const params = new URLSearchParams(url.hash.substring(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken && refreshToken) {
    const { data: sessionData } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionData.user) {
      const user = sessionData.user;
      const meta = user.user_metadata;
      await supabase.from("users").upsert(
        {
          id: user.id,
          name: meta.full_name ?? meta.name,
          email: user.email!,
          profile_picture: meta.avatar_url ?? null,
        },
        { onConflict: "id" },
      );
    }
  }
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleGooglePress() {
    setLoading(true);
    try {
      await signInWithGoogle();
      await queryClient.refetchQueries({ queryKey: ["auth"] });
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1} margin={24} />

      <YStack paddingHorizontal={24} paddingBottom={16} gap={12}>
        <Button
          onPress={handleGooglePress}
          disabled={loading}
          backgroundColor="#000"
          borderRadius={16}
          height={56}
          opacity={loading ? 0.6 : 1}
          pressStyle={{ opacity: 0.8 }}
        >
          <XStack alignItems="center" justifyContent="center">
            {loading ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons
                name="logo-google"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
            <Text fontSize={17} fontWeight="700" color="#fff">
              {loading ? "Signing in..." : "Continue with Google"}
            </Text>
          </XStack>
        </Button>

        <Text
          color="#999"
          textAlign="center"
          lineHeight={18}
          marginTop={4}
          paddingHorizontal={16}
          fontSize={12}
        >
          By continuing, you agree to our{" "}
          <Text
            textDecorationLine="underline"
            color="#999"
            fontSize={12}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://example.com/terms")
            }
          >
            Terms & Privacy Policy
          </Text>
          .
        </Text>
      </YStack>
    </SafeAreaView>
  );
}
