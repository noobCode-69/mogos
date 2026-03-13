import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Circle, Text, XStack, YStack } from "tamagui";
import Header from "../components/Header";

type PopupState = "closed" | "tap" | "holding" | "released";

function TapModal({
  bottom,
  onClose,
}: {
  bottom: number;
  onClose: () => void;
}) {
  return (
    <YStack
      position="absolute"
      bottom={bottom}
      left={15}
      right={15}
      height={200}
      backgroundColor="#fff"
      borderRadius={16}
      padding={20}
    >
      <Text fontSize={18} fontWeight="700" color="#c11c84" marginBottom={6}>
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
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#666" />
        </Circle>
        <Circle
          size={50}
          backgroundColor="#c11c84"
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.8 }}
          onPress={() => {}}
        >
          <Ionicons name="send" size={22} color="#fff" />
        </Circle>
      </XStack>
    </YStack>
  );
}

function HoldModal({
  bottom,
  state,
  onClose,
}: {
  bottom: number;
  state: "holding" | "released";
  onClose: () => void;
}) {
  return (
    <YStack
      position="absolute"
      bottom={bottom}
      left={15}
      right={15}
      height={200}
      backgroundColor="#fff"
      borderRadius={16}
      padding={20}
    >
      <Text fontSize={18} fontWeight="700" color="#c11c84" marginBottom={6}>
        {state === "holding" ? "Holding..." : "Not Holding"}
      </Text>

      {state === "released" && (
        <XStack position="absolute" right={15} bottom={15} gap={10}>
          <Circle
            size={50}
            backgroundColor="#eee"
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.8 }}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#666" />
          </Circle>
          <Circle
            size={50}
            backgroundColor="#c11c84"
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.8 }}
            onPress={() => {}}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </Circle>
        </XStack>
      )}
    </YStack>
  );
}

export default function GymTrack() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [state, setState] = useState<PopupState>("closed");
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

        {state === "tap" && (
          <TapModal
            bottom={insets.bottom + 16}
            onClose={() => setState("closed")}
          />
        )}

        {(state === "holding" || state === "released") && (
          <HoldModal
            bottom={insets.bottom + 16}
            state={state}
            onClose={() => setState("closed")}
          />
        )}

        {(state === "closed" || state === "holding") && (
          <Pressable
            onPressIn={() => {
              longPressTriggered.current = false;
            }}
            onLongPress={() => {
              longPressTriggered.current = true;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setState("holding");
            }}
            onPressOut={() => {
              if (longPressTriggered.current) {
                setState("released");
              }
            }}
            onPress={() => {
              if (!longPressTriggered.current) {
                setState("tap");
              }
            }}
            delayLongPress={500}
            style={{
              position: "absolute",
              right: 30,
              bottom: insets.bottom + 31,
              width: 50,
              height: 50,
              backgroundColor: "#c11c84",
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <Ionicons
              name={state === "holding" ? "ellipsis-horizontal" : "add"}
              size={state === "holding" ? 24 : 28}
              color="#fff"
            />
          </Pressable>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
