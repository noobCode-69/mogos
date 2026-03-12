import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Circle, View, XStack } from "tamagui";
import { fetchUser } from "../lib/fetchUser";
import ProfileButton from "./ProfileButton";

interface HeaderProps {
  left?: React.ReactNode;
}

export default function Header({ left }: HeaderProps) {
  const { data } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchUser,
  });

  return (
    <XStack alignItems="center" height={60}>
      <View flex={1}>{left}</View>
      <Circle
        size={40}
        backgroundColor="#fff"
        alignItems="center"
        justifyContent="center"
        marginRight={2}
        pressStyle={{ opacity: 0.7 }}
        onPress={() => {}}
      >
        <Ionicons name="notifications-outline" size={20} color="#000" />
      </Circle>
      {data?.profile_picture && (
        <ProfileButton profilePicture={data.profile_picture as string} />
      )}
    </XStack>
  );
}
