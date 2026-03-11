import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../components/Header";

export default function GymTrack() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
            <IconButton
              icon="chevron-left"
              size={20}
              onPress={() => router.back()}
              style={styles.backButton}
              iconColor="#000"
            />
          }
        />

        <FAB
          icon="plus"
          onPress={() => {}}
          style={[styles.fab, { bottom: insets.bottom + 16 }]}
          color="#fff"
          customSize={50}
        />
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
  backButton: {
    backgroundColor: "#fff",
    borderRadius: 10000000,
  },
  fab: {
    position: "absolute",
    right: 20,
    backgroundColor: "#c11c84",
    borderRadius: 30,
    shadowColor: "#7d1254",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
