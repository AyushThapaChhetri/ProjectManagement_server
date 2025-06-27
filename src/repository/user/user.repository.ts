import { UserUpdateRequest } from "../../dto/user/UserUpdateRequest.dto";
import prisma from "../../config/db.config";
import BaseRepository from "../contract/baseRepository";
import { UpdateUserParams } from "../../dto/user/UpdateUserParams.dto";
// import { DBError } from "@app/service/contract/errors/dbErrorHandler";
import { NotFoundError } from "../../service/contract/errors/errors";
import { DeleteUsersRequest } from "../../dto/user/UserDeleteManyRequest.dto";

// class UserRepository {
//   async findById(id: number) {
//     return prisma.user.findUnique({ where: { id } });
//   }
// }

class UserRepository extends BaseRepository {
  // constructor() {
  //   super();
  //   const subscription = await prisma.$subscribe.message({
  //     event: "create", // or 'update' | 'delete'
  //   });
  //   prisma.activitylog.insert((e)=>{insert(subsription)})
  // }
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
    // address?: string;
    address?: string | null;
    phone?: string | null;
    title?: string | null;
    avatarUrl?: string | null;
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

  async findManyUsersWithRoles(uids: DeleteUsersRequest) {
    return await prisma.user.findMany({
      where: {
        uid: {
          in: uids.uids,
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findByUid(uid: string) {
    // const user = await prisma.user.findUnique({
    //   where: { uid: uid },
    // });
    // if (!user) throw new NotFoundError("User not found");
    // // console.log("Find by Id:", user);
    // return user;
    return await prisma.user.findUnique({
      where: { uid: uid },
    });
  }
  async findByID(id: number) {
    // const user = await prisma.user.findUnique({
    //   where: { uid: uid },
    // });
    // if (!user) throw new NotFoundError("User not found");
    // // console.log("Find by Id:", user);
    // return user;
    return await prisma.user.findUnique({
      where: { id: id },
    });
  }

  async validateRoleUids(roleUids: string[]) {
    const count = await this.dbCatch(
      prisma.role.count({
        where: { uid: { in: roleUids } },
      })
    );
    if (count !== roleUids.length) {
      throw new Error("One or more roles do not exist");
    }
  }

  async replaceUserRolesByUid(
    userId: number,
    userUid: string,
    roleUids: string[]
  ) {
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    const roles = await prisma.role.findMany({
      where: { uid: { in: roleUids } },
      select: { id: true },
    });

    const data = roles.map((role) => ({
      userId,
      roleId: role.id,
    }));

    await prisma.userRole.createMany({ data });

    return this.getUserWithRoles(userUid);
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
  async getUserWithRoles(uid: string) {
    return await prisma.user.findUnique({
      where: { uid: uid },
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

  async update(uid: string, data: UpdateUserParams) {
    return await prisma.user.update({
      where: { uid },
      data,
      include: { userRoles: { include: { role: true } } },
    });
  }

  async deleteUsers(uids: string[], userId: number[]) {
    console.log("from repostiory delete", uids);
    await prisma.$transaction([
      prisma.refreshToken.deleteMany({
        where: {
          userId: {
            in: userId,
          },
        },
      }),
      prisma.user.deleteMany({
        where: {
          uid: {
            in: uids,
          },
        },
      }),
    ]);
  }

  async delete(uid: string) {
    return await prisma.user.delete({
      where: { uid },
    });
  }
}

export default new UserRepository();
