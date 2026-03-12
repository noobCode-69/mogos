import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Circle, Text, View, YStack } from "tamagui";
import Header from "../components/Header";

export default function GymTrack() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [popups, setPopups] = useState<number[]>([]);
  const longPressTriggered = useRef(false);

  return (
    <LinearGradient
      colors={["#fdb8db", "#F0F3F4"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
        <Header
          left={
            <Circle
              size={40}
              backgroundColor="#fff"
              alignItems="center"
              justifyContent="center"
              pressStyle={{ opacity: 0.7 }}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} color="#000" />
            </Circle>
          }
        />

        {popups.length > 0 && (
          <View position="absolute" bottom={90} left={15} right={15}>
            {popups.map((id, index) => (
              <YStack
                key={id}
                width="100%"
                height={200}
                backgroundColor="#fff"
                borderRadius={16}
                padding={20}
                marginBottom={10}
              >
                <Text
                  fontSize={18}
                  fontWeight="700"
                  color="#c11c84"
                  marginBottom={6}
                >
                  Workout {index + 1}
                </Text>
                <Text fontSize={14} color="#888">
                  Add your workout details here
                </Text>
              </YStack>
            ))}
          </View>
        )}

        <Pressable
          onPressIn={() => {
            longPressTriggered.current = false;
          }}
          onLongPress={() => {
            longPressTriggered.current = true;
            setPopups((prev) => [...prev, Date.now()]);
          }}
          onPress={() => {
            if (!longPressTriggered.current) {
              setPopups([Date.now()]);
            }
          }}
          delayLongPress={500}
          style={{
            position: "absolute",
            right: 20,
            bottom: insets.bottom + 16,
            width: 50,
            height: 50,
            backgroundColor: "#c11c84",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}
