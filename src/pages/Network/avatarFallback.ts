import avatar1 from "../../assets/images/avatar1.svg";
import avatar2 from "../../assets/images/avatar2.svg";
import avatar3 from "../../assets/images/avatar3.svg";
import avatar4 from "../../assets/images/avatar4.svg";
import avatar5 from "../../assets/images/avatar5.svg";

const AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5];

export function getAvatarForUser(userId: number): string {
  return AVATARS[userId % AVATARS.length];
}
