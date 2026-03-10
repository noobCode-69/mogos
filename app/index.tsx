import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export async function fetchUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const id = session?.user?.id;
  if (!id) return null;
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return user;
}

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
              <Text style={styles.greeting}>
                Hello, {data.name?.split(" ")[0]}
              </Text>
              <Text style={styles.subtitle}>Keep Mogging!</Text>
            </View>
          }
        />

        <Pressable
          onPress={() => router.push("/gym-track")}
          style={({ pressed }) => [
            styles.gymButton,
            {
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <Text style={styles.gymButtonText}>Gym Track</Text>
        </Pressable>
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
    fontSize: 21,
    fontWeight: "800",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "grey",
    marginTop: 3,
  },
  gymButton: {
    backgroundColor: "#c11c84",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  gymButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
