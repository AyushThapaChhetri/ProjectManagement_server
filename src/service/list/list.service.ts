import { ListRequest } from "@app/dto/list/ListRequest.dto";
import { ListRepository } from "../../repository/list/list.repository";
import { ForbiddenError, NotFoundError } from "../contract/errors/errors";
import { UserService } from "../user/user.service";
import { User } from "@prisma/client";
import { ProjectService } from "../project/project.service";

class _ListService {
  async create(
    currentUserUid: string,
    params: {
      projectUid: string;
      name: string;
    }
  ) {
    const { projectUid } = params;

    // 1. Validate project and list
    const project = await ProjectService.getByUid(projectUid);

    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const currentUserId = currentUser.id;

    const listData = {
      projectId: project.id,
      name: params.name,
      createdById: currentUserId,
    };

    const list = await ListRepository.create(listData);
    const AddedListData = {
      ...list,
      projectUid,
      createdByUid: currentUserUid,
    };
    return AddedListData;
  }

  async getAllPaginated(page: number, limit: number) {
    return ListRepository.findAllPaginated(page, limit);
  }

  async updateList(
    currentUserUid: string,
    listUid: string,

    params: {
      name: string;
      projectUid: string;
    }
  ) {
    const { projectUid, ...rest } = params;
    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const list = await this.getByUid(listUid);

    const roles = currentUser.userRoles.map((r) => r.role.name);

    const privilegedRoles = ["Admin", "Super Admin"];

    const hasPrivilegeRole = roles.some((role) =>
      privilegedRoles.includes(role)
    );

    const isProjectManager = roles.includes("Project Manager");

    const isChangingOthersList =
      isProjectManager &&
      !hasPrivilegeRole &&
      currentUser.id !== list.createdById;

    if (isChangingOthersList) {
      throw new ForbiddenError(
        "Manager not allowed to change another manager created list"
      );
    }

    const project = await ProjectService.getByUid(projectUid);

    const listData = {
      ...rest,
      projectId: project.id,
    };
    return ListRepository.update(listUid, listData);
  }

  async patchList(
    currentUserUid: string,
    listUid: string,

    params: Partial<ListRequest>
  ) {
    const { projectUid, ...rest } = params;
    const currentUser = await UserService.getUserWithRoles(currentUserUid);
    const list = await this.getByUid(listUid);

    const roles = currentUser.userRoles.map((r) => r.role.name);

    const privilegedRoles = ["Admin", "Super Admin"];

    const hasPrivilegeRole = roles.some((role) =>
      privilegedRoles.includes(role)
    );

    const isProjectManager = roles.includes("Project Manager");

    const isChangingOthersList =
      isProjectManager &&
      !hasPrivilegeRole &&
      currentUser.id !== list.createdById;

    if (isChangingOthersList) {
      throw new ForbiddenError(
        "Manager not allowed to change another manager created list"
      );
    }

    let projectId: number | undefined = undefined;
    if (projectUid) {
      const project = await ProjectService.getByUid(projectUid);
      projectId = project.id;
    }

    const listData = {
      ...rest,
      ...(projectId !== undefined ? { projectId } : {}),
    };
    return ListRepository.patch(listUid, listData);
  }

  async deleteList(listUid: string, currentUser: User) {
    const list = await ListRepository.findByUid(listUid);
    if (!list) {
      throw new NotFoundError("List not found");
    }

    //  Ownership check
    // Fetch the user with roles from the repository
    const user = await UserService.getUserWithRoles(currentUser.uid);
    const roles = user.userRoles.map((ur) => ur.role.name);

    const privilegedRoles = ["Admin", "Super Admin"];
    const isPrivileged = roles.some((role) => privilegedRoles.includes(role));
    const isOnlyProjectManager =
      roles.includes("Project Manager") && !isPrivileged;

    const isTryingToDeleteOthersList =
      isOnlyProjectManager && currentUser.id !== list.createdById;

    if (isTryingToDeleteOthersList) {
      throw new ForbiddenError(
        "Manager not allowed to delete another manager created list"
      );
    }

    return await ListRepository.delete(listUid);
  }

  async getByUid(listUid: string) {
    const list = await ListRepository.findByUid(listUid);
    if (!list) throw new NotFoundError("List not found");
    return list;
  }
}

export const ListService = new _ListService();
