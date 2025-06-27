import Hash from "@app/libs/Hash";
import UserRepository from "../../repository/user/user.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UserAlreadyExistError,
} from "../contract/errors/errors";
import { UserUpdateRequest } from "../../dto/user/UserUpdateRequest.dto";
import { UpdateUserParams } from "../../dto/user/UpdateUserParams.dto";
import { DeleteUsersRequest } from "../../dto/user/UserDeleteManyRequest.dto";

class _UserService {
  // async getCurrentUser(id: number) {
  //   const userProfile = await UserRepository.findById(id);
  //   console.log("Profile from service: ", userProfile);
  //   return userProfile;
  // }

  private readonly SUPER_ADMIN_ROLE = "Super Admin";
  private readonly ADMIN_ROLE = "Admin";

  async create(params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    dob: Date;
    address?: string | null;
    phone?: string | null;
    title?: string | null;
    avatarUrl?: string | null;
  }) {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      dob,
      address,
      phone,
      title,
      avatarUrl,
    } = params;

    // First check if the email already exists
    const existingUser = await UserRepository.checkUser(email);

    if (existingUser) {
      throw new UserAlreadyExistError("Email already Exists");
    }

    const hashedPassword = await Hash.createHash(password);

    const user = await UserRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      dob, // Convert dob to Date format
      address,
      phone,
      title,
      avatarUrl,
    });

    return user;
  }

  async findManyUsersWithRoles(uids: DeleteUsersRequest) {
    return await UserRepository.findManyUsersWithRoles(uids);
  }

  async getAllPaginated(page: number, limit: number) {
    return UserRepository.findAllPaginated(page, limit);
  }

  async getByIdWithRoles(uid: string) {
    const user = await this.getUserWithRoles(uid);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async update(
    uidToUpdate: string,
    data: UpdateUserParams,
    currentUserUid: string
  ) {
    const updateData = data.dob ? { ...data, dob: new Date(data.dob) } : data;

    // return await UserRepository.update(uid, updateData);

    // fetch roles of the user you’re about to update
    const userToUpdate = await this.getUserWithRoles(uidToUpdate);
    if (!userToUpdate) throw new NotFoundError("User not found");

    const currentUser = await this.getUserWithRoles(currentUserUid);
    if (!currentUser) throw new ForbiddenError("Current user not authorized");

    const isTargetSuperAdmin = userToUpdate.userRoles.some(
      (ur) => ur.role.name === this.SUPER_ADMIN_ROLE
    );

    const isCurrentUserSuperAdmin = currentUser.userRoles.some(
      (ur) => ur.role.name === this.SUPER_ADMIN_ROLE
    );
    // Allow update only if:
    // - target is NOT super admin, or
    // - target IS super admin AND current user is the SAME user
    if (
      isTargetSuperAdmin &&
      (currentUserUid !== uidToUpdate || !isCurrentUserSuperAdmin)
    ) {
      throw new ForbiddenError("Cannot modify other superAdmin accounts");
    }

    return await UserRepository.update(uidToUpdate, updateData);
  }

  async getUserWithRoles(uid: string) {
    const user = await UserRepository.getUserWithRoles(uid);
    if (!user) throw new NotFoundError("User not found");

    return user;
  }

  async findByUid(uid: string) {
    const user = await UserRepository.findByUid(uid);
    if (!user) throw new NotFoundError("User not found");
    console.log("Find by Id:", user);
    return user;
  }
  async findById(id: number) {
    const user = await UserRepository.findByID(id);
    if (!user) throw new NotFoundError("User not found");
    console.log("Find by Id:", user);
    return user;
  }

  async updateUserRoles(userUid: string, roleUids: string[]) {
    // 1) Ensure user exists
    const user = await this.findByUid(userUid);
    if (!user) throw new NotFoundError("User not found");

    // 2) Optionally: validate that each roleUid exists
    await UserRepository.validateRoleUids(roleUids);

    // 3) Replace roles
    const updated = await UserRepository.replaceUserRolesByUid(
      user.id,
      userUid,
      roleUids
    );

    console.log("updated datas: ", updated);

    if (!updated) throw new NotFoundError("No data found");
    return updated;
  }

  async deleteManyUser(uids: DeleteUsersRequest, currentUserUid: string) {
    console.log("All the Uids from service", uids);
    console.log("All the Uids from service", currentUserUid);
    const currentUser = await this.getUserWithRoles(currentUserUid);

    const isCurrentUserAdmin = currentUser.userRoles.some(
      (ur) => ur.role.name === this.ADMIN_ROLE
    );

    const users = await this.findManyUsersWithRoles(uids);
    console.log("users outside:", users);

    const userId = users.map((ur) => ur.id);

    if (users.length !== uids.uids.length) {
      const foundIds = new Set(users.map((u) => u.uid));
      const missing = uids.uids.filter((uid) => !foundIds.has(uid));

      throw new NotFoundError(`Some users not found: ${missing.join(",")}`);
    }

    for (const user of users) {
      // console.log("user from service", user);
      console.log("user from service", user.uid);
      const userWithRole = user;

      const isTargetSuperAdmin = userWithRole.userRoles.some(
        (ur) => ur.role.name === this.SUPER_ADMIN_ROLE
      );

      if (isTargetSuperAdmin) {
        throw new ForbiddenError("SuperAdmin Cannot Be Deleted.");
      }

      const isTargetAdmin = userWithRole.userRoles.some(
        (ur) => ur.role.name === this.ADMIN_ROLE
      );

      if (isCurrentUserAdmin && isTargetAdmin && user.uid !== currentUser.uid) {
        throw new ForbiddenError("Admin cannot delete another Admin");
      }
    }

    await UserRepository.deleteUsers(uids.uids, userId);
  }

  async delete(uidToUpdate: string, currentUserUid: string) {
    // fetch roles of the user you’re about to update
    // console.log("From user service delete");
    const userToUpdate = await this.getUserWithRoles(uidToUpdate);

    const currentUser = await this.getUserWithRoles(currentUserUid);

    const isTargetSuperAdmin = userToUpdate.userRoles.some(
      (ur) => ur.role.name === this.SUPER_ADMIN_ROLE
    );

    const isCurrentUserSuperAdmin = currentUser.userRoles.some(
      (ur) => ur.role.name === this.SUPER_ADMIN_ROLE
    );
    // Allow update only if:
    // - target is NOT super admin, or
    // - target IS super admin AND current user is the SAME user
    if (
      isTargetSuperAdmin &&
      (currentUserUid !== uidToUpdate || !isCurrentUserSuperAdmin)
    ) {
      throw new ForbiddenError("Cannot modify other superAdmin accounts");
    }

    return await UserRepository.delete(uidToUpdate);
  }
}

export const UserService = new _UserService();
// export default new _UserService();
