// project.service.ts
import prisma from "@app/config/db.config";
import ProjectRepository from "../../repository/project/project.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../contract/errors/errors";
import { User } from "@prisma/client";

import userService from "../user/user.service";

class ProjectService {
  async create(projectData: {
    name: string;
    description?: string;
    deadline?: Date;
    managerId: number;
  }) {
    const manager = await prisma.user.findUnique({
      where: { id: projectData.managerId },
    });

    if (!manager) throw new Error("Manager not found");

    return ProjectRepository.create(projectData);
  }

  async getAllPaginated(page: number, limit: number) {
    return ProjectRepository.findAllPaginated(page, limit);
  }

  async getById(projectId: number) {
    return ProjectRepository.findById(projectId);
  }

  async updateProject(
    projectId: number,
    updateData: {
      name?: string;
      description?: string;
      deadline?: Date;
    }
  ) {
    const existingProject = await ProjectRepository.findById(projectId);

    if (!existingProject) {
      throw new BadRequestError("Project not found");
    }

    return ProjectRepository.updateProject(projectId, updateData);
  }

  async findAllByManager(managerId: number) {
    return ProjectRepository.findAllByManager(managerId);
  }

  async deleteProject(projectId: number, currentUser: User) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    //  Ownership check
    // Fetch the user with roles from the repository
    const user = await userService.getUserWithRoles(currentUser.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }
    const roles = user.userRoles.map((ur) => ur.role.name);
    // If Project Manager, only allow delete if they own the project
    if (
      roles.includes("Project Manager") &&
      project.managerId !== currentUser.id
    ) {
      throw new ForbiddenError("You are not allowed to delete this project");
    }

    await ProjectRepository.deleteProject(projectId);
  }
}

export default new ProjectService();
