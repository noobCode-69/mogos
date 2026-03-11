import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MuscleMap from "../../components/MuscleMap";
import { Tables } from "../../lib/database.types";

type Exercise = Tables<"exercises">;

export default function ExerciseDetail() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const router = useRouter();
  const exercise: Exercise = JSON.parse(data);

  const targetMuscles = exercise.target ? [exercise.target] : [];
  const secondaryMuscles = exercise.secondary_muscles ?? [];
  const muscles = [...targetMuscles, ...secondaryMuscles];

  return (
    <LinearGradient
      colors={["#fdb8db", "#F0F3F4"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {exercise.name}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <MuscleMap
            targetMuscles={targetMuscles}
            secondaryMuscles={secondaryMuscles}
          />

          {muscles.length > 0 && (
            <View style={styles.pillsRow}>
              {muscles.map((muscle, index) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{muscle}</Text>
                </View>
              ))}
            </View>
          )}

          {exercise.instructions && exercise.instructions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Instructions</Text>
              {exercise.instructions.map((step, index) => (
                <View key={index} style={styles.instructionRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.instructionStep}>{step}</Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.addButtonText}>Add</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10000000,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#25141f",
    textAlign: "center",
    textTransform: "capitalize",
  },
  content: {
    paddingBottom: 40,
    gap: 18,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f5f0f3",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b5a63",
    textTransform: "capitalize",
  },
  section: {
    gap: 10,
    paddingTop: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25141f",
  },
  sectionText: {
    fontSize: 14,
    color: "#5a4a53",
    lineHeight: 21,
  },
  instructionRow: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5a4a53",
    lineHeight: 21,
  },
  instructionStep: {
    flex: 1,
    fontSize: 14,
    color: "#5a4a53",
    lineHeight: 21,
  },
  addButton: {
    backgroundColor: "#e75480",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
