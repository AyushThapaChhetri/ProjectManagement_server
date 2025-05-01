import { User } from "@prisma/client";

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
}
export const UserDTO = new _UserDTO();
