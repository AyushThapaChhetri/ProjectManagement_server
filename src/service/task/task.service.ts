import prisma from "@app/config/db.config";
import { NotFoundError } from "../contract/errors/errors";
import TaskRepository from "../../repository/task/task.repository";

class TaskService {
  async create(params: {
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
    const { projectId, assignedToId } = params;

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      throw new NotFoundError(`Project doesn't exist: ${projectId}`);
    }

    if (assignedToId) {
      const userExists = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!userExists) {
        throw new NotFoundError(`Assigned user doesn't exist: ${assignedToId}`);
      }
    }

    return TaskRepository.create(params);
  }

  async findByUser(userId: number) {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundError(`User doesn't exist: ${userExists}`);
    }
    return TaskRepository.findByUser(userId);
  }
}

export default new TaskService();
