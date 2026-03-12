import { Ionicons } from "@expo/vector-icons";

import { Circle, Text, YStack } from "tamagui";

import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1} paddingHorizontal={24}>
        <Circle
          size={40}
          marginLeft={-8}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.7 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#666" />
        </Circle>
        <Text fontWeight="700" color="#000" marginBottom={12} fontSize={28}>
          Profile
        </Text>
        <Text color="#888" fontSize={16}>
          Profile page coming soon.
        </Text>
      </YStack>
    </SafeAreaView>
  );
}
