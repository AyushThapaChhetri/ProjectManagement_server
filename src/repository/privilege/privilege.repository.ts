import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class _PrivilegeRepository extends BaseRepository {
  async create(name: string, description?: string) {
    return super.dbCatch(
      prisma.privilege.create({
        data: { name, description },
      })
    );
  }

  async findAll() {
    return super.dbCatch(prisma.privilege.findMany());
  }

  async findPrivilegeByIds(Ids: number[]) {
    return prisma.privilege.findMany({
      where: { id: { in: Ids } },
    });
  }
}

export const PrivilegeRepository = new _PrivilegeRepository();
