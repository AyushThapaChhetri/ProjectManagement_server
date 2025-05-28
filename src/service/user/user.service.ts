import Hash from "@app/libs/Hash";
import UserRepository from "../../repository/user/user.repository";
import {
  BadRequestError,
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

  async getByIdWithRoles(id: number) {
    const user = await this.getUserWithRoles(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async update(id: number, data: UpdateUserParams) {
    const updateData = data.dob ? { ...data, dob: new Date(data.dob) } : data;

    return await UserRepository.update(id, updateData);
  }

  async getUserWithRoles(id: number) {
    const user = await UserRepository.getUserWithRoles(id);
    if (!user) throw new NotFoundError("User not found");

    return user;
  }

  async findByUid(uid: string) {
    return await UserRepository.findByUid(uid);
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
      roleUids
    );

    console.log("updated datas: ", updated);

    if (!updated) throw new NotFoundError("No data found");
    return updated;
  }

  async delete(id: number) {
    const user = await this.getUserWithRoles(id);
    if (!user) throw new NotFoundError("User not found");
    return UserRepository.delete(id);
  }
}

export default new UserService();
// export default new _UserService();
