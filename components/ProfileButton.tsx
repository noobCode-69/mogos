import { useRouter } from "expo-router";
import { Circle, Image } from "tamagui";

interface ProfileButtonProps {
  profilePicture: string;
}

export default function ProfileButton({ profilePicture }: ProfileButtonProps) {
  const router = useRouter();

  return (
    <Circle
      size={40}
      overflow="hidden"
      pressStyle={{ opacity: 0.7 }}
      onPress={() => router.push("/profile")}
    >
      <Image
        src={profilePicture}
        width={40}
        height={40}
        borderRadius={20}
      />
    </Circle>
  );
}
