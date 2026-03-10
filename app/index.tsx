import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Hello, {data.name?.split(" ")[0]}
            </Text>
            <Text style={styles.subtitle}>Keep Mogging Bro!</Text>
          </View>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              styles.notificationButton,
              {
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.9 : 1 }],
              },
            ]}
          >
            <Ionicons name="notifications-outline" size={20} color="#000" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/profile")}
            style={({ pressed }) => [
              styles.profileButton,
              {
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.9 : 1 }],
              },
            ]}
          >
            <Image
              source={{ uri: data.profile_picture as string }}
              style={styles.avatar}
            />
          </Pressable>
        </View>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
  },
  greeting: {
    fontSize: 21,
    fontWeight: "800",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 10000000,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 10000000,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100000,
  },
});
