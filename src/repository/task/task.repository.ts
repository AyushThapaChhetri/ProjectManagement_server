import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class TaskRepository extends BaseRepository {
  async create(
    createData: {
      projectId: number;
      listId: number;
      name: string;
      description: string | null;
      priority: string;
      status: string;
      startDate: Date | null;
      endDate: Date | null;
      estimatedHours: number | null;
      createdById: number;
    },
    assignedUsers:
      | {
          id: number;
        }[]
      | null
  ) {
    return super.dbCatch(
      prisma.task.create({
        data: {
          ...createData,
          ...(assignedUsers
            ? { assignedToUsers: { connect: assignedUsers } }
            : {}),
        },
        include: {
          assignedToUsers: true,
          project: true,
          list: true,
          createdBy: true,
        },
      })
    );
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
          assignedToUsers: {
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
      prisma.task.findMany({
        where: {
          assignedToUsers: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          assignedToUsers: true,
          project: true,
          list: true,
        },
      })
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
    },
    assignedUsers?: {
      id: number;
    }[]
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
          ...(assignedUsers ? { assingedToUsers: { set: assignedUsers } } : {}),
        },
        include: {
          project: true,
          list: true,
          assignedToUsers: true,
          createdBy: true,
        },
      })
    );
  }

  async patchTask(
    taskUid: string,
    patchData: Partial<{
      projectId: number;
      listId: number;
      name: string;
      description: string;
      priority: string;
      status: string;
      startDate: Date;
      endDate: Date;
      estimatedHours: number;
    }>,
    assignedUsers?: {
      id: number;
    }[]
  ) {
    return super.dbCatch(
      prisma.task.update({
        where: { uid: taskUid },
        data: {
          ...patchData,
          updatedAt: new Date(),
          ...(assignedUsers ? { assignedToUsers: { set: assignedUsers } } : {}),
        },
        include: {
          assignedToUsers: true,
          project: true,
          list: true,
          createdBy: true,
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
          assignedToUsers: {
            select: {
              uid: true,
            },
          },
        },
      }),
    ]);
    return { tasks, total };
  }
  async findUsersByTaskUid(taskUid: string) {
    return await super.dbCatch(
      prisma.task.findUnique({
        where: { uid: taskUid },
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
          assignedToUsers: true,
        },
      })
    );
  }
}

export default new TaskRepository();
