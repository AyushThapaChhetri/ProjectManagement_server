import { User } from "@prisma/client";
import { UserResponseData } from "./UserResponse.dto";
import { UserWithRoles } from "../../@types/UserWithRoles";

class _UserDTO {
  single(user: UserWithRoles): UserResponseData {
    return {
      uid: user.uid,
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
      roles: user.userRoles?.map((ur: any) => ur.role.name) || [],
    };
  }

  /** maps an array of users to an array of UserResponseData */
  list(users: UserWithRoles[]): UserResponseData[] {
    return users.map((u) => this.single(u));
  }
}
export const UserDTO = new _UserDTO();
