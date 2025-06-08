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

class UserService {
  // async getCurrentUser(id: number) {
  //   const userProfile = await UserRepository.findById(id);
  //   console.log("Profile from service: ", userProfile);
  //   return userProfile;
  // }

  private readonly SUPER_ADMIN_ROLE = "Super Admin";

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

  async delete(uidToUpdate: string, currentUserUid: string) {
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

    return UserRepository.delete(uidToUpdate);
  }
}

export default new UserService();
// export default new _UserService();
