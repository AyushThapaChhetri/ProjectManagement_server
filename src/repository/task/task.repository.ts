import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class TaskRepository extends BaseRepository {
  async create(data: {
    projectId: number;
    name: string;
    description?: string;
    priority: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
    estimatedHours?: number;
    assignedToId?: number;
  }) {
    return super.dbCatch(prisma.task.create({ data }));
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

  async findManagerId(taskId: number) {
    return await super.dbCatch(
      prisma.task.findUnique({
        where: { id: taskId },
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

  async findByUser(userId: number) {
    return super.dbCatch(
      prisma.task.findMany({ where: { assignedToId: userId } })
    );
  }

  async updateTask(
    taskId: number,
    data: {
      projectId: number;
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
        where: { id: taskId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    );
  }

  async patchTask(
    taskId: number,
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
        where: { id: taskId },
        data: {
          ...patchData,
          updatedAt: new Date(),
        },
      })
    );
  }

  async deleteTask(taskId: number) {
    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export default new TaskRepository();
