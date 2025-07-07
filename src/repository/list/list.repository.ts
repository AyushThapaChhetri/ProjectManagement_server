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
        orderBy: { createdAt: "asc" },
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
  async findAllListByProject(
    page: number,
    limit: number,
    projectId: number | null
  ) {
    const whereClause = projectId !== null ? { projectId } : {};
    const [total, lists] = await Promise.all([
      prisma.list.count({
        where: whereClause, // Apply the filter here too
      }),
      prisma.list.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "asc" },
        where: whereClause,

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
      include: {
        createdBy: {
          select: {
            uid: true,
          },
        },
      },
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
      include: {
        project: {
          select: { uid: true },
        },
        createdBy: {
          select: { uid: true },
        },
      },
    });
  }

  async delete(listId: number) {
    super.dbCatch(
      prisma.$transaction([
        prisma.task.deleteMany({ where: { listId } }),
        prisma.list.delete({ where: { id: listId } }),
      ])
    );
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
  async findManagerByListUid(listUid: string) {
    return super.dbCatch(
      prisma.list.findUnique({
        where: {
          uid: listUid,
        },
        include: {
          project: {
            select: {
              createdBy: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
    );
  }
}

export const ListRepository = new _ListRepository();
