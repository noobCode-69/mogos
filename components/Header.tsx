import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
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
    <View style={styles.topBar}>
      <View style={styles.leftSection}>{left}</View>
      <IconButton
        icon="bell-outline"
        size={20}
        onPress={() => {}}
        style={styles.notificationButton}
        iconColor="#000"
      />
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
  leftSection: {
    flex: 1,
  },
  notificationButton: {
    backgroundColor: "#fff",
    borderRadius: 10000000,
    marginRight: 2,
  },
});
