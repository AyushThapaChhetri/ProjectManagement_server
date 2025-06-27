// project.service.ts
import prisma from "@app/config/db.config";
import ProjectRepository from "../../repository/project/project.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../contract/errors/errors";
import { User } from "@prisma/client";
import { UserService } from "../user/user.service";

class _ProjectService {
  async create(
    currentUserUid: string,
    params: {
      name: string;
      description: string | null;
      deadline: Date | null;
      managerUid: string | null;
    }
  ) {
    const { name, managerUid } = params;

    //  Check if project with the same name already exists
    const existingProject = await ProjectRepository.findByName(name);
    if (existingProject) {
      throw new BadRequestError("Project with this name already exists.");
    }

    // let managerToId: number | null = null;
    // if (managerUid) {
    //   const assignedProjectManager = await UserService.getUserWithRoles(managerUid);
    //   managerToId = assignedProjectManager.id;
    // }

    const managerId = await this.resolveUserUidToIdWithRoles(
      params.managerUid,
      ["Super Admin", "Admin", "Project Manager"],
      "Assigned user must be a Project Manager or higher."
    );

    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const currentUserId = currentUser.id;
    const projectData = {
      name: params.name,
      description: params.description,
      deadline: params.deadline,
      managerId: managerId,
      createdById: currentUserId,
    };

    const project = await ProjectRepository.create(projectData);
    const AddResponseProject = {
      ...project,
      managerUid,
      createdByUid: currentUserUid,
    };
    return AddResponseProject;
  }

  async getAllPaginated(page: number, limit: number) {
    return await ProjectRepository.findAllPaginated(page, limit);
  }

  async updateProject(
    currentUserUid: string,
    projectUid: string,
    updateData: {
      name: string;
      description: string | null;
      deadline: Date | null;
      managerUid: string | null;
    }
  ) {
    const projectDetails = await this.getByUid(projectUid);
    const { managerUid, ...rest } = updateData;

    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const roles = currentUser.userRoles.map((r) => r.role.name);

    const privilegedRoles = ["Admin", "Super Admin"];

    const hasPrivilegeRole = roles.some((role) =>
      privilegedRoles.includes(role)
    );

    const isProjectManager = roles.includes("Project Manager");

    if (!hasPrivilegeRole && isProjectManager && managerUid) {
      throw new ForbiddenError("Manager not allowed to change the manager Uid");
    }

    // let managerId: number | null = null;
    // if (managerUid) {
    //   const manager = await UserService.getUserWithRoles(managerUid);
    //   managerId = manager.id;
    // }

    // Reuse helper for managerUid
    const managerId = await this.resolveUserUidToIdWithRoles(
      managerUid,
      ["Super Admin", "Admin", "Project Manager"],
      "Assigned user must be a Project Manager or higher."
    );

    const payload = {
      ...rest,
      managerId,
    };

    const project = ProjectRepository.updateProject(projectDetails.id, payload);

    return project;
  }
  async PatchProject(
    currentUserUid: string,
    projectUid: string,
    patchData: Partial<{
      name: string;
      description: string | null;
      deadline: Date | null;
      managerUid: string | null;
    }>
  ) {
    const projectDetails = await this.getByUid(projectUid);
    const { managerUid } = patchData;

    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const roles = currentUser.userRoles.map((r) => r.role.name);

    const privilegedRoles = ["Admin", "Super Admin"];

    const hasPrivilegeRole = roles.some((role) =>
      privilegedRoles.includes(role)
    );

    const isProjectManager = roles.includes("Project Manager");

    if (!hasPrivilegeRole && isProjectManager && managerUid) {
      throw new ForbiddenError("Manager not allowed to change the manager Uid");
    }

    if (managerUid) {
      await UserService.getUserWithRoles(managerUid);
    }

    // Build payload
    const patchPayload: {
      name?: string;
      description?: string | null;
      deadline?: Date | null;
      managerId?: number | null;
    } = { ...patchData };

    if ("managerUid" in patchData) {
      // If explicitly null, clear it
      if (patchData.managerUid === null) {
        patchPayload.managerId = null;
      } else {
        // Use helper to validate and resolve UID ➝ ID
        patchPayload.managerId = await this.resolveUserUidToIdWithRoles(
          patchData.managerUid ?? null,
          ["Super Admin", "Admin", "Project Manager"],
          "Assigned user must be a Project Manager or higher."
        );
      }
    }

    // Remove `managerUid` before passing to repo
    delete (patchPayload as any).managerUid;

    const project = ProjectRepository.patchProject(
      projectDetails.id,
      patchPayload
    );

    return project;
  }

  async deleteProject(projectUid: string, currentUser: User) {
    const project = await this.getByUid(projectUid);

    //  Ownership check
    // Fetch the user with roles from the repository
    const user = await UserService.getUserWithRoles(currentUser.uid);

    const roles = user.userRoles.map((ur) => ur.role.name);
    // If Project Manager, only allow delete if they own the project
    if (
      roles.includes("Project Manager") &&
      project.managerId !== currentUser.id
    ) {
      throw new ForbiddenError("You are not allowed to delete this project");
    }

    return await ProjectRepository.deleteProject(projectUid);
  }

  async findAllByManager(managerId: number) {
    return ProjectRepository.findAllByManager(managerId);
  }

  async getById(projectId: number) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  async getByUid(projectUid: string) {
    const project = await ProjectRepository.findByUid(projectUid);
    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  // Private helper: resolve a managerUid to managerId, enforcing allowed roles
  private async resolveUserUidToIdWithRoles(
    userUid: string | null,
    allowedRoles: string[],
    errorMessage: string
  ): Promise<number | null> {
    if (!userUid) {
      return null;
    }
    const user = await UserService.getUserWithRoles(userUid);
    const hasRole = user.userRoles?.some((ur) =>
      allowedRoles.includes(ur.role.name)
    );
    if (!hasRole) {
      throw new ForbiddenError(errorMessage);
    }
    return user.id;
  }
}

export const ProjectService = new _ProjectService();
