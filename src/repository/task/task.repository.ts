import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class TaskRepository extends BaseRepository {
  async create(data: {
    projectId: number;
    listId: number;
    name: string;
    description?: string;
    priority: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
    estimatedHours?: number;
    assignedToId?: number;
    createdById?: number;
  }) {
    return super.dbCatch(prisma.task.create({ data }));
  }

  async findProjectByUid(projectUid: string) {
    return await prisma.project.findUnique({
      where: { uid: projectUid },
    });
  }
  async findAllPaginated(page: number, limit: number) {
    const [total, tasks] = await Promise.all([
      prisma.task.count(),
      prisma.task.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "asc" },
        include: {
          createdBy: {
            select: {
              uid: true,
            },
          },
          list: {
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
    return { tasks, total };
  }

  async findManagerId(taskUid: string) {
    return await super.dbCatch(
      prisma.task.findUnique({
        where: { uid: taskUid },
        select: {
          project: {
            select: {
              managerId: true,
            },
          },
        },
      })
    );
  }

  // Add these methods to the existing repository

  async findById(taskId: number) {
    return super.dbCatch(
      prisma.task.findUnique({
        where: { id: taskId },
      })
    );
  }
  async findByUid(taskUid: string) {
    return await super.dbCatch(
      prisma.task.findUnique({
        where: { uid: taskUid },
      })
    );
  }

  async findByUser(userId: number) {
    return super.dbCatch(
      prisma.task.findMany({ where: { assignedToId: userId } })
    );
  }

  async updateTask(
    taskUid: string,
    data: {
      projectId: number;
      listId: number;
      name: string;
      description?: string;
      priority: string;
      status: string;
      startDate?: Date;
      endDate?: Date;
      estimatedHours?: number;
      assignedToId?: number;
    }
  ) {
    // prisma.$transaction(async (tx){
    //   await tx.role.create({data:{name:"BAC"}});
    //   const role = await prisma.role.findFirst({where:{name:"BAC"}})
    //   throw new BadRequestError("");
    // });

    return super.dbCatch(
      prisma.task.update({
        where: { uid: taskUid },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    );
  }

  async patchTask(
    taskUid: string,
    patchData: Partial<{
      projectId: number;
      name: string;
      description: string;
      priority: string;
      status: string;
      startDate: Date;
      endDate: Date;
      estimatedHours: number;
      assignedToId: number;
    }>
  ) {
    return super.dbCatch(
      prisma.task.update({
        where: { uid: taskUid },
        data: {
          ...patchData,
          updatedAt: new Date(),
        },
      })
    );
  }

  async deleteTask(taskUid: string) {
    await prisma.task.delete({
      where: { uid: taskUid },
    });
  }

  async deleteAllTask(listId: number) {
    return await super.dbCatch(
      prisma.task.deleteMany({
        where: { listId },
      })
    );
  }

  async findAllTaskByProject(
    page: number,
    limit: number,
    projectId: number | null
  ) {
    const whereClause = projectId !== null ? { projectId } : {};
    const [total, tasks] = await Promise.all([
      prisma.task.count({
        where: whereClause,
      }),
      prisma.task.findMany({
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
          list: {
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
    return { tasks, total };
  }
}

export default new TaskRepository();
