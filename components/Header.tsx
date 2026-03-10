import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, View } from "react-native";
import { fetchUser } from "../app/index";
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
    <View style={styles.topBar}>
      <View style={{ flex: 1 }}>{left}</View>
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
      {data?.profile_picture && (
        <ProfileButton profilePicture={data.profile_picture as string} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
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
});
