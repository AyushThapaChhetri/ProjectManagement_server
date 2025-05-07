import { UserUpdateRequest } from "../../dto/user/UserUpdateRequest.dto";
import prisma from "../../config/db.config";
import BaseRepository from "../contract/baseRepository";
import { UpdateUserParams } from "../../dto/user/UpdateUserParams.dto";

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
    // Step 1: Create the user
    const user = await this.dbCatch(
      prisma.user.create({
        data: params,
        include: { userRoles: { include: { role: true } } },
      })
    );

    // Step 2: Fetch the 'Employee' role
    const employeeRole = await prisma.role.findUnique({
      where: { name: "Employee" },
    });

    // Step 3: Assign role if found
    if (employeeRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: employeeRole.id,
        },
      });
    }

    // Step 4: Return the created user
    return user;
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

  async getUserWithRoles(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
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

  async findAllPaginated(page: number, limit: number) {
    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { userRoles: { include: { role: true } } },
      }),
    ]);
    return { users, total };
  }

  async update(id: number, data: UpdateUserParams) {
    return await prisma.user.update({
      where: { id },
      data,
      include: { userRoles: { include: { role: true } } },
    });
  }

  async delete(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();
