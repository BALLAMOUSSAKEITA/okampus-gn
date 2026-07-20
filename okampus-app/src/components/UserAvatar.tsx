import Image from "next/image";
import { getAvatarSrc, inferGenderFromName, type AvatarGender } from "@/lib/avatars";

type UserAvatarProps = {
  name?: string;
  gender?: AvatarGender;
  size?: number;
  className?: string;
  rounded?: "full" | "lg" | "md";
};

export default function UserAvatar({
  name,
  gender,
  size = 48,
  className = "",
  rounded = "full",
}: UserAvatarProps) {
  const resolvedGender = gender ?? (name ? inferGenderFromName(name) : "male");
  const src = getAvatarSrc(resolvedGender);
  const roundedClass =
    rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-lg" : "rounded-md";

  return (
    <Image
      src={src}
      alt={name ? `Avatar de ${name}` : "Avatar utilisateur"}
      width={size}
      height={size}
      className={`${roundedClass} object-cover bg-[#f4f4f8] shrink-0 ${className}`}
    />
  );
}
