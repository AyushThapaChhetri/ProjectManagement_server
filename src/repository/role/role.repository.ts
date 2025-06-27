import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class RoleRepository extends BaseRepository {
  async create(name: string) {
    return super.dbCatch(prisma.role.create({ data: { name } }));
  }

  async findAll() {
    return super.dbCatch(prisma.role.findMany());
  }

  async assignPrivilege(roleId: number, privilegeId: number) {
    return super.dbCatch(
      prisma.rolePrivilege.create({
        data: { roleId, privilegeId },
      })
    );
  }

  async findPrivilegesFromRoles(roles: string[]) {
    return prisma.role.findMany({
      where: { name: { in: roles } },
      include: {
        rolePrivileges: {
          select: {
            privilegeId: true,
          },
        },
      },
    });
  }
}

export default new RoleRepository();
