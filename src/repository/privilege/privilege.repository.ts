import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class PrivilegeRepository extends BaseRepository {
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
}

export default new PrivilegeRepository();
