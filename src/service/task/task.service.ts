import prisma from "@app/config/db.config";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../contract/errors/errors";
import TaskRepository from "../../repository/task/task.repository";
import { User } from "@prisma/client";
import UserService from "../user/user.service";
import { PatchTaskRequest } from "@app/dto/task/PatchTaskRequest.dto";

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

  async getAllPaginated(page: number, limit: number) {
    return TaskRepository.findAllPaginated(page, limit);
  }

  async getById(taskId: number) {
    const existingTask = await TaskRepository.findById(taskId);

    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }
    return TaskRepository.findById(taskId);
  }

  async updateTask(
    taskId: number,
    updateData: {
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
    const existingTask = await TaskRepository.findById(taskId);

    if (!existingTask) {
      throw new BadRequestError("Task not found");
    }

    return TaskRepository.updateTask(taskId, updateData);
  }

  async patch(
    uid: string,
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
    // 1. Validate inputs
    if (!uid || !taskId) throw new BadRequestError("Invalid IDs");

    // 2. Fetch user
    const user = await UserService.getUserWithRoles(uid);
    if (!user) throw new NotFoundError("User not found");

    // 3. Authorization check
    const roles = user.userRoles.map((ur) => ur.role.name);

    // const isOnlyStatusField = (obj: object) =>
    //   Object.keys(obj).length === 1 && "status" in obj;

    const isOnlyAllowedFields = (obj: object, allowedFields: string[]) => {
      const keys = Object.keys(obj);

      // Check if all keys are in the allowed fields
      return keys.every((key) => allowedFields.includes(key));
    };

    // Define the allowed fields for employees
    const allowedFields = ["status"];

    if (roles.includes("Employee") && !roles.includes("Manager")) {
      if (!isOnlyAllowedFields(patchData, allowedFields)) {
        throw new ForbiddenError("Only 'status' update is allowed");
      }
    }

    // 4. Business logic & DB update
    const updated = await TaskRepository.patchTask(taskId, patchData);

    // 5. Return
    return updated;
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

  async deleteTask(taskId: number, currentUser: User) {
    const project = await TaskRepository.findById(taskId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    //  Ownership check
    // Fetch the user with roles from the repository
    const user = await UserService.getUserWithRoles(currentUser.uid);

    if (!user) {
      throw new NotFoundError("User not found");
    }
    const roles = user.userRoles.map((ur) => ur.role.name);

    const managerObj = await TaskRepository.findManagerId(taskId);

    const managerId = managerObj?.project?.managerId;

    // If Project Manager, only allow delete if they own the project
    if (roles.includes("Project Manager") && currentUser.id !== managerId) {
      throw new ForbiddenError("Not allowed to delete Task");
    }

    return await TaskRepository.deleteTask(taskId);
  }
}

export default new TaskService();
