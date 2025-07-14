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

class _TaskService {
  async create(
    currentUserUid: string,
    params: {
      projectUid: string;
      listUid: string;
      name: string;
      description: string | null;
      priority: string;
      status: string;
      startDate: Date | null;
      endDate: Date | null;
      estimatedHours: number | null;
      assignedToUsers: string[] | null;
    }
  ) {
    const { projectUid, listUid, assignedToUsers } = params;

    // 1. Validate project and list
    const project = await ProjectService.getByUid(projectUid);
    const list = await ListService.getByUid(listUid);

    let assignedUsers: { id: number }[] | null = null;
    if (assignedToUsers && assignedToUsers.length > 0) {
      try {
        const users = await Promise.all(
          assignedToUsers.map(async (uid) => {
            const user = await UserService.findByUid(uid);
            return { id: user.id };
          })
        );
        assignedUsers = users;
      } catch (err) {
        throw new BadRequestError(
          `Invalid assignedToUid: ${(err as Error).message}`
        );
      }
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
      createdById: currentUserId,
      projectId: project.id,
      listId: list.id,
    };

    const task = await TaskRepository.create(taskData, assignedUsers);
    const AddResponseTask = {
      ...task,
      projectUid: task.project.uid,
      listUid: task.list.uid,
      assignedToUsers: task.assignedToUsers,
      createdByUid: task.createdBy?.uid,
    };
    return AddResponseTask;
  }

  async getAllPaginated(page: number, limit: number) {
    const tasks = await TaskRepository.findAllPaginated(page, limit);
    console.log("Task from the service", tasks);

    return tasks;
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
      assignedToUsers?: string[];
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

    let assignedUsers: { id: number }[] | undefined;

    if (updateData.assignedToUsers && updateData.assignedToUsers.length > 0) {
      const users = await Promise.all(
        updateData.assignedToUsers.map(async (uid) => {
          const user = await UserService.findByUid(uid);
          return { id: user.id };
        })
      );
      assignedUsers = users;
    }
    const task = await TaskRepository.updateTask(taskUid, data, assignedUsers);

    const AddResponseTask = {
      ...task,
      projectUid: task.project.uid,
      listUid: task.list.uid,
      assignedToUsers: task.assignedToUsers,
      createdBy: task.createdBy,
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
      assignedToUsers: string[];
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

    // Create a safe shallow clone of patchData
    const updatePayload = { ...patchData };

    let assignedUsers: { id: number }[] | undefined = undefined;

    if (patchData.assignedToUsers && patchData.assignedToUsers.length > 0) {
      try {
        const users = await Promise.all(
          patchData.assignedToUsers.map(async (uid) => {
            const user = await UserService.findByUid(uid);
            return { id: user.id };
          })
        );

        assignedUsers = users;
        // delete patchData.assignedToUsers;
        delete updatePayload.assignedToUsers;
      } catch (err) {
        throw new BadRequestError(
          `Invalid assignedToUid: ${(err as Error).message}`
        );
      }
    }

    console.log("From service:", updatePayload);
    // 4. Business logic & DB update
    const updated = await TaskRepository.patchTask(
      taskUid,
      updatePayload,
      assignedUsers
    );

    // const project = await ProjectService.getById(updated.projectId);

    // const list = await ListService.getById(updated.listId);

    // let assignedToUid: string | null = null;
    // if (updated.assignedToId) {
    //   const assignedUser = await UserService.findById(updated.assignedToId);
    //   assignedToUid = assignedUser.uid;
    // }

    const AddResponseTask = {
      ...updated,
      projectUid: updated.project.uid,
      listUid: updated.list.uid,
      assignedToUsers: updated.assignedToUsers,
      createdBy: updated.createdBy,
    };
    console.log("From service return to controller:", AddResponseTask);
    return AddResponseTask;
  }

  async deleteTask(taskUid: string, currentUser: User) {
    console.log("Taskuid: ", taskUid);
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
    console.log("Before deletion Service layer", taskUid);
    await TaskRepository.deleteTask(taskUid);
  }
  async deleteAllTask(listUid: string, currentUser: User) {
    console.log("listuid: ", listUid);
    const list = await ListService.getByUid(listUid);
    if (!list) {
      throw new NotFoundError("List not found");
    }

    //  Ownership check
    // Fetch the user with roles from the repository
    const user = await UserService.getUserWithRoles(currentUser.uid);

    const roles = user.userRoles.map((ur) => ur.role.name);

    const managerObj = await ListService.getManagerByListUid(listUid);

    const managerId = managerObj?.project?.createdBy?.id;

    // If Project Manager, only allow delete if they own the project
    if (roles.includes("Project Manager") && currentUser.id !== managerId) {
      throw new ForbiddenError("Not allowed to delete Task");
    }
    // console.log("Before deletion Service layer", listUid);
    await TaskRepository.deleteAllTask(list.id);
  }

  async getTaskByProject(
    page: number,
    limit: number,
    projectId: number | null
  ) {
    const tasks = await TaskRepository.findAllTaskByProject(
      page,
      limit,
      projectId
    );
    if (!tasks) throw new NotFoundError("Tasks not found");
    return tasks;
  }

  async getUsersByTaskUid(taskUid: string) {
    const tasks = await TaskRepository.findUsersByTaskUid(taskUid);
    if (!tasks) throw new NotFoundError("Tasks not found");
    return tasks;
  }
}

export const TaskService = new _TaskService();
