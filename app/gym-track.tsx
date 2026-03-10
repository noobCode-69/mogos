import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DaySlider from "../components/DaySlider";
import Header from "../components/Header";

export default function GymTrack() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

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
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                {
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
            >
              <Ionicons name="chevron-back" size={20} color="#000" />
            </Pressable>
          }
        />
        <DaySlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
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
    width: 40,
    height: 40,
    borderRadius: 10000000,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
