import { useQueryClient } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<{
    session?: { user: { user_metadata: Record<string, string> } };
  }>(["auth"]);
  const name =
    authData?.session?.user.user_metadata.full_name ??
    authData?.session?.user.user_metadata.name ??
    "";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome {name}</Text>
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
