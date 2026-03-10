import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet } from "react-native";

interface ProfileButtonProps {
  profilePicture: string;
}

export default function ProfileButton({ profilePicture }: ProfileButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/profile")}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        {
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
      ]}
    >
      <Image source={{ uri: profilePicture }} style={styles.avatar} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 10000000,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100000,
  },
});
