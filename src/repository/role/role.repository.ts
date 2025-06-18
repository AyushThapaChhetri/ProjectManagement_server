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
}

export default new RoleRepository();
