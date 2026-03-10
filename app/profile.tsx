import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.placeholder}>Profile page coming soon.</Text>
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
  back: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 16,
    color: "#888",
  },
});
