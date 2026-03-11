import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "../hooks/useDebounce";
import { supabase } from "../lib/supabase";

type Exercise = {
  id: number;
  name: string;
  muscle_hit: string[];
  images: string[];
};

const fetchExercises = async (search: string) => {
  let query = supabase.from("exercises").select("*").order("name").limit(50);

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Exercise[];
};

export default function AddWorkout() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 300);

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ["exercises", debouncedSearch],
    queryFn: () => fetchExercises(debouncedSearch),
  });

  const renderExercise = ({ item }: { item: Exercise }) => (
    <Pressable
      style={({ pressed }) => [
        styles.exerciseItem,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.muscleTag}>{item.muscle_hit.join(", ")}</Text>
    </Pressable>
  );

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
              styles.closeButton,
              {
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.9 : 1 }],
              },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </Pressable>
          <TextInput
            autoFocus
            placeholder="Search exercises"
            placeholderTextColor="#8d7b87"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#e75480"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderExercise}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>No exercises found</Text>
            }
          />
        )}
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
    gap: 10,
    marginBottom: 18,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10000000,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#25141f",
  },
  list: {
    paddingBottom: 40,
  },
  exerciseItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#25141f",
  },
  muscleTag: {
    fontSize: 13,
    color: "#8d7b87",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#8d7b87",
    fontSize: 15,
    marginTop: 40,
  },
});
