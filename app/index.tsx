import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";
import Header from "../components/Header";
import { fetchUser } from "../lib/fetchUser";

export default function Index() {
  const router = useRouter();

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
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
        <Header
          left={
            <YStack>
              <Text fontWeight="800" color="#000" fontSize={22}>
                Hello, {data.name?.split(" ")[0]}
              </Text>
              <Text color="grey" marginTop={3} fontSize={14}>
                Keep Mogging!
              </Text>
            </YStack>
          }
        />

        <Button
          onPress={() => router.push("/gym-track")}
          backgroundColor="#c11c84"
          borderRadius={12}
          marginTop={30}
          height={52}
          pressStyle={{ opacity: 0.8 }}
        >
          <Text fontSize={16} fontWeight="700" color="#fff">
            Gym Track
          </Text>
        </Button>
      </SafeAreaView>
    </LinearGradient>
  );
}
