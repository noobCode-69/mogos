import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { fetchUser } from "../lib/fetchUser";

export default function Index() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchUser,
  });

  if (isLoading) return null;

  if (data === null || data === undefined) {
    return <Redirect href="/login" />;
  }

  if (!data.onboarding_data) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <LinearGradient
      colors={["#fdb8db", "#F0F3F4"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header
          left={
            <View>
              <Text variant="titleLarge" style={styles.greeting}>
                Hello, {data.name?.split(" ")[0]}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Keep Mogging!
              </Text>
            </View>
          }
        />

        <Button
          mode="contained"
          onPress={() => router.push("/gym-track")}
          buttonColor="#c11c84"
          textColor="#fff"
          contentStyle={styles.gymButtonContent}
          labelStyle={styles.gymButtonLabel}
          style={styles.gymButton}
        >
          Gym Track
        </Button>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  greeting: {
    fontWeight: "800",
    color: "#000",
  },
  subtitle: {
    color: "grey",
    marginTop: 3,
  },
  gymButton: {
    borderRadius: 12,
    marginTop: 30,
  },
  gymButtonContent: {
    paddingVertical: 6,
  },
  gymButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
