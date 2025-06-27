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
        orderBy: { createdAt: "desc" },
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
    return super.dbCatch(
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
}

export default new TaskRepository();
