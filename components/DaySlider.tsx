import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface DaySliderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DaySlider({
  selectedDate,
  onSelectDate,
}: DaySliderProps) {
  const today = new Date();
  const monthDays = getMonthDays(today);

  return (
    <View style={styles.container}>
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
              onPress={() => !isFuture && onSelectDate(item)}
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
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: "darkgray",
  },
});
