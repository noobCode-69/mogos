import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Avatar, TouchableRipple } from "react-native-paper";

interface ProfileButtonProps {
  profilePicture: string;
}

export default function ProfileButton({ profilePicture }: ProfileButtonProps) {
  const router = useRouter();

  return (
    <TouchableRipple
      onPress={() => router.push("/profile")}
      borderless
      style={styles.button}
      rippleColor="rgba(0, 0, 0, 0.1)"
    >
      <Avatar.Image source={{ uri: profilePicture }} size={40} />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10000000,
    overflow: "hidden",
  },
});
