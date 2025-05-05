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

  async findByUser(userId: number) {
    return super.dbCatch(
      prisma.task.findMany({ where: { assignedToId: userId } })
    );
  }
}

export default new TaskRepository();
