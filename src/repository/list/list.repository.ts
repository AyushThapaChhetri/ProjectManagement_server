import BaseRepository from "../contract/baseRepository";
import prisma from "../../config/db.config";

class _ListRepository extends BaseRepository {
  async create(data: { projectId: number; name: string; createdById: number }) {
    return super.dbCatch(prisma.list.create({ data }));
  }

  async findAllPaginated(page: number, limit: number) {
    const [total, lists] = await Promise.all([
      prisma.list.count(),
      prisma.list.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: {
              uid: true,
            },
          },
          project: {
            select: {
              uid: true,
            },
          },
        },
      }),
    ]);
    return { lists, total };
  }

  async update(
    listUid: string,
    listData: {
      name: string;
      projectId: number;
    }
  ) {
    return await prisma.list.update({
      where: { uid: listUid },
      data: { ...listData, updatedAt: new Date() },
    });
  }
  async patch(
    listUid: string,
    listData: {
      name?: string;
      projectId?: number;
    }
  ) {
    return await prisma.list.update({
      where: { uid: listUid },
      data: { ...listData, updatedAt: new Date() },
    });
  }

  async delete(listUid: string) {
    return await prisma.list.delete({
      where: { uid: listUid },
    });
  }
  async findByUid(listUid: string) {
    return await prisma.list.findUnique({
      where: { uid: listUid },
    });
  }
  async findById(listId: number) {
    return await prisma.list.findUnique({
      where: { id: listId },
    });
  }
}

export const ListRepository = new _ListRepository();
