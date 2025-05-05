import { User } from "@prisma/client";
import { UserResponseData } from "./UserResponse.dto";

class _UserDTO {
  single(user: User) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      dob: user.dob.toISOString(),
      address: user.address,
      phone: user.phone,
      title: user.title,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /** maps an array of users to an array of UserResponseData */
  list(users: any[]): UserResponseData[] {
    return users.map(UserDTO.single);
  }
}
export const UserDTO = new _UserDTO();
