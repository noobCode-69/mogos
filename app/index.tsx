import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome {data.name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    lineHeight: 34,
  },
});
