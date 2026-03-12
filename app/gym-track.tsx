import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Circle, Text, View, XStack, YStack } from "tamagui";
import Header from "../components/Header";

export default function GymTrack() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

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

        {isOpen ? (
          <YStack
            position="absolute"
            bottom={insets.bottom + 16}
            left={15}
            right={15}
            height={200}
            backgroundColor="#fff"
            borderRadius={16}
            padding={20}
          >
            <Text
              fontSize={18}
              fontWeight="700"
              color="#c11c84"
              marginBottom={6}
            >
              New Workout
            </Text>
            <Text fontSize={14} color="#888">
              Add your workout details here
            </Text>

            <XStack position="absolute" right={15} bottom={15} gap={10}>
              <Circle
                size={50}
                backgroundColor="#eee"
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setIsOpen(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </Circle>
              <Circle
                size={50}
                backgroundColor="#c11c84"
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => {
                  // send action here
                }}
              >
                <Ionicons name="send" size={22} color="#fff" />
              </Circle>
            </XStack>
          </YStack>
        ) : (
          <Circle
            size={50}
            backgroundColor="#c11c84"
            position="absolute"
            right={30}
            bottom={insets.bottom + 31}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setIsOpen(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </Circle>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
