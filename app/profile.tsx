import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <IconButton
          icon="arrow-left"
          size={22}
          onPress={() => router.back()}
          style={styles.backButton}
          iconColor="#666"
        />
        <Text variant="headlineLarge" style={styles.heading}>
          Profile
        </Text>
        <Text variant="bodyLarge" style={styles.placeholder}>
          Profile page coming soon.
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginLeft: -8,
  },
  heading: {
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  placeholder: {
    color: "#888",
  },
});
