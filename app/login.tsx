import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.graphicPlaceholder} />

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleGooglePress}
          loading={loading}
          disabled={loading}
          icon={({ size, color }) => (
            <Ionicons name="logo-google" size={size} color={color} />
          )}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          style={styles.googleButton}
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </Button>

        <Text variant="bodySmall" style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text
            variant="bodySmall"
            style={styles.termsLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://example.com/terms")
            }
          >
            Terms & Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphicPlaceholder: {
    flex: 1,
    margin: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  googleButton: {
    borderRadius: 16,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: "700",
  },
  termsText: {
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  termsLink: {
    textDecorationLine: "underline",
    color: "#999",
  },
});
