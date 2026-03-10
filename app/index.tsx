import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function Index() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const monthDays = getMonthDays(today);

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
            <Text style={styles.subtitle}>Keep Mogging!</Text>
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

        <View style={styles.calendarContainer}>
          <FlatList
            data={monthDays}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toISOString()}
            initialScrollIndex={Math.max(today.getDate() - 3, 0)}
            getItemLayout={(_, index) => ({
              length: 58,
              offset: 58 * index,
              index,
            })}
            renderItem={({ item }) => {
              const isToday = isSameDay(item, today);
              const isSelected = isSameDay(item, selectedDate);
              const isFuture = item > today && !isToday;
              return (
                <Pressable
                  onPress={() => !isFuture && setSelectedDate(item)}
                  style={({ pressed }) => [
                    styles.dayItem,
                    !isFuture &&
                      pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
                  ]}
                  disabled={isFuture}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      isSelected && styles.selectedDayLabel,
                      isToday && !isSelected && styles.todayDayLabel,
                      isFuture && styles.futureDayLabel,
                    ]}
                  >
                    {DAY_LABELS[item.getDay()]}
                  </Text>

                  <View
                    style={[
                      styles.dayCircle,
                      isSelected && styles.selectedDayCircle,
                      isToday && !isSelected && styles.todayDayCircle,
                      isFuture && styles.futureDayCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        isSelected && styles.selectedDayNumber,
                        isToday && !isSelected && styles.todayDayNumber,
                        isFuture && styles.futureDayNumber,
                      ]}
                    >
                      {item.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
        <Text style={styles.selectedDateText}>
          {formatFullDate(selectedDate)}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}></ScrollView>
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
    color: "grey",
    marginTop: 3,
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
  calendarContainer: {
    marginTop: 40,
  },
  dayItem: {
    width: 48,
    alignItems: "center",
    marginHorizontal: 2,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "grey",
    marginBottom: 10,
  },
  selectedDayLabel: {
    color: "#c11c84",
  },
  todayDayLabel: {
    color: "#c11c84",
  },
  futureDayLabel: {
    color: "darkgray",
  },

  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.25,
    borderStyle: "dashed",
    borderColor: "grey",
  },
  selectedDayCircle: {
    backgroundColor: "#c11c84",
    borderColor: "#c11c84",
    borderStyle: "solid",
  },
  todayDayCircle: {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderColor: "#c11c84",
  },
  futureDayCircle: {
    borderColor: "darkgray",
  },

  dayNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "grey",
  },
  selectedDayNumber: {
    color: "white",
  },
  todayDayNumber: {
    color: "#c11c84",
  },
  futureDayNumber: {
    color: "#darkgray",
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 50,
    textAlign: "center",
  },
});
