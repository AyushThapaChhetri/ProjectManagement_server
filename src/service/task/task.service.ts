import prisma from "@app/config/db.config";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../contract/errors/errors";
import TaskRepository from "../../repository/task/task.repository";
import { User } from "@prisma/client";

import { PatchTaskRequest } from "@app/dto/task/PatchTaskRequest.dto";
import { ListService } from "../list/list.service";
import { RoleService } from "../role/role.service";
import { UserService } from "../user/user.service";
import { ProjectService } from "../project/project.service";

class TaskService {
  async create(
    currentUserUid: string,
    params: {
      projectUid: string;
      listUid: string;
      name: string;
      description?: string;
      priority: string;
      status: string;
      startDate?: Date;
      endDate?: Date;
      estimatedHours?: number;
      assignedToUid?: string;
    }
  ) {
    const { projectUid, listUid, assignedToUid } = params;

    // 1. Validate project and list
    const project = await ProjectService.getByUid(projectUid);
    const list = await ListService.getByUid(listUid);

    let assignedToId: number | undefined;
    if (assignedToUid) {
      const assignedUser = await UserService.findByUid(assignedToUid);
      assignedToId = assignedUser.id;
    }

    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const currentUserId = currentUser.id;

    // 4. Prepare and pass full task data to repository
    const taskData = {
      name: params.name,
      description: params.description,
      priority: params.priority,
      status: params.status,
      startDate: params.startDate,
      endDate: params.endDate,
      estimatedHours: params.estimatedHours,
      assignedToId,
      createdById: currentUserId,
      projectId: project.id,
      listId: list.id,
    };

    const task = await TaskRepository.create(taskData);
    const AddResponseTask = {
      ...task,
      projectUid,
      listUid,
      assignedToUid,
      createdByUid: currentUserUid,
    };
    return AddResponseTask;
  }

  async getAllPaginated(page: number, limit: number) {
    return TaskRepository.findAllPaginated(page, limit);
  }

  async getByUid(taskUid: string) {
    const Task = await TaskRepository.findByUid(taskUid);

    if (!Task) {
      throw new NotFoundError("Task not found");
    }
    return Task;
  }

  async updateTask(
    taskUid: string,
    updateData: {
      projectUid: string;
      listUid: string;
      name: string;
      description?: string;
      priority: string;
      status: string;
      startDate?: Date;
      endDate?: Date;
      estimatedHours?: number;
      assignedToUid?: string;
    }
  ) {
    const Task = await this.getByUid(taskUid);
    const project = await ProjectService.getByUid(updateData.projectUid);
    const list = await ListService.getByUid(updateData.listUid);

    const data = {
      name: updateData.name,
      description: updateData.description,
      priority: updateData.priority,
      status: updateData.status,
      startDate: updateData.startDate,
      endDate: updateData.endDate,
      estimatedHours: updateData.estimatedHours,
      projectId: project.id,
      listId: list.id,
    };
    let assignedToId: number | undefined;
    if (updateData.assignedToUid) {
      const user = await UserService.findByUid(updateData.assignedToUid);
      assignedToId = user.id;
    }

    const taskData = { ...data, assignedToId };
    const task = TaskRepository.updateTask(taskUid, taskData);

    const AddResponseTask = {
      ...task,
      projectUid: project.uid,
      listUid: list.uid,
      assignedToUid: project.managerId,
    };
    return AddResponseTask;
  }

  async patch(
    uid: string,
    taskUid: string,
    patchData: Partial<{
      projectUid: string;
      listUid: string;
      name: string;
      description: string;
      priority: string;
      status: string;
      startDate: Date;
      endDate: Date;
      estimatedHours: number;
      assignedToUid: string;
      assignedToId: number;
    }>
  ) {
    // 1. Validate inputs
    if (!uid || !taskUid) throw new BadRequestError("Invalid IDs");

    const { projectUid, listUid } = patchData;
    const Task = await this.getByUid(taskUid);
    if (projectUid) {
      const project = await ProjectService.getByUid(projectUid);
    }
    if (listUid) {
      const list = await ListService.getByUid(listUid);
    }

    // 2. Fetch user
    const user = await UserService.getUserWithRoles(uid);

    // 3. Authorization check
    const roles = user.userRoles.map((ur) => ur.role.name);
    const privileges = await RoleService.getPrivilegesFromRoles(roles);
    const privilegeName = privileges.map((p) => p.name);

    const isFullEditor = privilegeName.includes("update_task");

    if (!isFullEditor) {
      const allowedFields = ["status"];
      const invalidFields = Object.keys(patchData).filter(
        (key) => !allowedFields.includes(key)
      );
      if (invalidFields.length > 0) {
        throw new ForbiddenError("Only 'status' update is allowed");
      }
    }

    // Handle assignedToUid -> assignedToId
    if (patchData.assignedToUid) {
      const assignedUser = await UserService.findByUid(patchData.assignedToUid);
      patchData.assignedToId = assignedUser.id;
      delete patchData.assignedToUid;
    }
    // 4. Business logic & DB update
    const updated = await TaskRepository.patchTask(taskUid, patchData);

    const project = await ProjectService.getById(updated.projectId);

    const list = await ListService.getById(updated.listId);

    let assignedToUid: string | null = null;
    if (updated.assignedToId) {
      const assignedUser = await UserService.findById(updated.assignedToId);
      assignedToUid = assignedUser.uid;
    }

    const AddResponseTask = {
      ...updated,
      projectUid: project.uid,
      listUid: list.uid,
      assignedToUid,
    };
    return AddResponseTask;
  }

  async deleteTask(taskUid: string, currentUser: User) {
    const task = await TaskRepository.findByUid(taskUid);
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    //  Ownership check
    // Fetch the user with roles from the repository
    const user = await UserService.getUserWithRoles(currentUser.uid);

    const roles = user.userRoles.map((ur) => ur.role.name);

    const managerObj = await TaskRepository.findManagerId(taskUid);

    const managerId = managerObj?.project?.managerId;

    // If Project Manager, only allow delete if they own the project
    if (roles.includes("Project Manager") && currentUser.id !== managerId) {
      throw new ForbiddenError("Not allowed to delete Task");
    }

    return await TaskRepository.deleteTask(taskUid);
  }
}

export default new TaskService();
