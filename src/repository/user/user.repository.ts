import prisma from "../../config/db.config";
import BaseRepository from "../contract/baseRepository";

// class UserRepository {
//   async findById(id: number) {
//     return prisma.user.findUnique({ where: { id } });
//   }
// }

class UserRepository extends BaseRepository {
  async checkUser(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    dob: Date;
    address?: string;
    phone?: string;
    title?: string;
    avatarUrl?: string;
  }) {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      dob,
      address,
      phone,
      title,
      avatarUrl,
    } = params;

    return super.dbCatch(
      prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          gender,
          dob,
          address,
          phone,
          title,
          avatarUrl,
        },
      })
    );
  }

  async assignRole(userId: number, roleId: number) {
    return super.dbCatch(
      prisma.userRole.create({
        data: {
          userId,
          roleId,
        },
      })
    );
  }

  async getUserPrivileges(userId: number) {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: { include: { rolePrivileges: { include: { privilege: true } } } },
      },
    });
    return userRoles.flatMap((ur) =>
      ur.role.rolePrivileges.map((rp) => rp.privilege.name)
    );
  }
}

export default new UserRepository();
