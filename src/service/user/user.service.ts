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
    address?: string;
    phone?: string;
    title?: string;
    avatarUrl?: string;
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

    return await UserRepository.create({
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

    // return user;
  }

  async getAllPaginated(page: number, limit: number) {
    return UserRepository.findAllPaginated(page, limit);
  }

  async getByIdWithRoles(id: number) {
    const user = await UserRepository.getUserWithRoles(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async update(id: number, data: UpdateUserParams) {
    const updateData = data.dob ? { ...data, dob: new Date(data.dob) } : data;

    return UserRepository.update(id, updateData);
  }

  async delete(id: number) {
    const user = await UserRepository.getUserWithRoles(id);
    if (!user) throw new NotFoundError("User not found");
    return UserRepository.delete(id);
  }
}

export default new UserService();
// export default new _UserService();
