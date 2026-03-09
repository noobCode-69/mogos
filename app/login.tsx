import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      await supabase
        .from("users")
        .upsert({ id: sessionData.user.id }, { onConflict: "id" });
    }
  }
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleGooglePress() {
    setLoading(true);
    try {
      await signInWithGoogle();
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.graphicPlaceholder} />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.googleButton, loading && styles.googleButtonLoading]}
          activeOpacity={0.8}
          onPress={handleGooglePress}
          disabled={loading}
        >
          <Ionicons
            name="logo-google"
            size={18}
            color={loading ? "#999" : "#000"}
          />
          <Text
            style={[
              styles.googleButtonText,
              loading && styles.googleButtonTextLoading,
            ]}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text
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
    backgroundColor: "#fff",
  },
  graphicPlaceholder: {
    flex: 1,
    margin: 24,
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  googleButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700",
  },
  googleButtonLoading: {
    backgroundColor: "#E8E8E8",
  },
  googleButtonTextLoading: {
    color: "#999",
  },
  termsText: {
    fontSize: 12,
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
