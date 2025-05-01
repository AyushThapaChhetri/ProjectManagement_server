import Hash from "@app/libs/Hash";
import UserRepository from "../../repository/user/user.repository";
import {
  BadRequestError,
  UserAlreadyExistError,
} from "../contract/errors/errors";

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
}

export default new UserService();
// export default new _UserService();
