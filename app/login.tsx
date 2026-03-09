import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.graphicPlaceholder} />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.appleButton} activeOpacity={0.8}>
          <Ionicons name="logo-apple" size={20} color="#fff" />
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={18} color="#000" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
  appleButton: {
    backgroundColor: "#1A1A2E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
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
