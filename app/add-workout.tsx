import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
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
import { Tables } from "../lib/database.types";
import { supabase } from "../lib/supabase";

type Exercise = Tables<"exercises">;

const fetchExercises = async (search: string) => {
  let query = supabase.from("exercises").select("*").order("name").limit(25);

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
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
      onPress={() =>
        router.push({
          pathname: "/exercise/[id]",
          params: { id: item.id, data: JSON.stringify(item) },
        })
      }
      style={({ pressed }) => [
        styles.exerciseItem,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          autoplay={false}
          style={styles.exerciseImage}
        />
      ) : (
        <View style={[styles.exerciseImage, styles.imagePlaceholder]}>
          <Ionicons name="barbell-outline" size={28} color="#ccc" />
        </View>
      )}
      <Text style={styles.exerciseName} numberOfLines={1}>
        {item.name}
      </Text>
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
          <View style={styles.listWrapper}>
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderExercise}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>No exercises found</Text>
              }
            />
          </View>
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
  listWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  list: {
    paddingBottom: 40,
  },
  exerciseItem: {
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  imagePlaceholder: {
    backgroundColor: "#f5f0f3",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#25141f",
  },
  emptyText: {
    textAlign: "center",
    color: "#8d7b87",
    fontSize: 15,
    marginTop: 40,
  },
});
