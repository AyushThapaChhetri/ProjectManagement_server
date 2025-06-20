import BaseController from "./contract/baseController.contract";
import { Request as ExRequest } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@app/service/contract/errors/errors";
import { UserDTO } from "../dto/user/user.dto";
import {
  Body,
  Delete,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Put,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { BadRequestErrorResponse } from "../dto/Error/BadRequestErrorResponse.dto";
import UserService from "../service/user/user.service";
import { SignupRequest } from "../dto/user/SignupRequest.dto";
import { UserResponse, UserResponseData } from "../dto/user/UserResponse.dto";
import { ErrorResponse } from "../dto/Error/ErrorResponse.dto";
import { InternalErrorResponse } from "../dto/Error/InternalErrorResponse.dto";
import { authorize } from "../middlewares/authorization";
import { validate_schemas } from "@app/middlewares/validationMiddleware";
import {
  UserSignupValidationSchema,
  UserUpdateValidationSchema,
} from "./validation/user.validation";
import { UserUpdateRequest } from "../dto/user/UserUpdateRequest.dto";
import { DeleteUserResponse } from "../dto/user/UserDeleteResponse.dto";
import { UpdateUserParams } from "../dto/user/UpdateUserParams.dto";
import { UserListResponse } from "../dto/user/UserListResponse.dto";
import { RoleUpdateRequest } from "../dto/user/RoleRequest.dto";
import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
import { DeleteUsersRequest } from "../dto/user/UserDeleteManyRequest.dto";

// @Response<ValidationErrorResponse>(422, "Validation failed")
// @Response<BadRequestErrorResponse>(400, "BadRequestError")
@Route("api/user")
@Tags("User")
export class _UserController extends BaseController {
  @SuccessResponse("200", "SignUp successful")
  @Response<ErrorResponse>(409, "Conflict - email already registered")
  @Response<ValidationErrorResponse>(
    422,
    "Unprocessable Entity – validation errors",
    {
      message: "Validation failed",
      errors: [{ field: "email", message: "Please Enter Email" }],
    }
  )
  @Response<InternalErrorResponse>(500, "Internal server error")
  @Middlewares(validate_schemas(UserSignupValidationSchema))
  @Post("signup")
  // async getProfile(@Request() request: ExRequest) {
  async create(@Body() signUpData: SignupRequest): Promise<UserResponse> {
    // const id = request.id;
    const {
      // fullName,
      firstName,
      lastName,
      email, // Renaming emailName to email
      password, // Renaming emailPassword to password
      confirmPassword, // Renaming emailConfirmPassword to confirmPassword
      gender,
      dob, // Renaming emailDob to dob
      address = null,
      phone = null,
      title = null,
      avatarUrl = null,
    } = signUpData;

    console.log("Creating user!", signUpData);
    const user = await UserService.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
      dob: new Date(dob), // Ensure dob is converted to Date format
      address: address ?? null, // Ensure null conversion
      phone: phone ?? null,
      title: title ?? null,
      avatarUrl: avatarUrl ?? null,
    });

    // if (!userProfile) {
    //   throw new BadRequestError("User not found or not authenticated");
    // }

    // const { firstName, lastName, email, gender, dob } = userProfile;

    // Send success response
    return super.postOk({
      message: "User created successfully",
      data: UserDTO.single(user),
    });
  }

  // GET ALL USERS
  @Security("jwt")
  @SuccessResponse("200", "Users fetched successfully")
  @Get()
  @Middlewares([authorize("read_user")])
  async getAllUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Request() request: ExRequest
  ): Promise<UserListResponse> {
    const { users, total } = await UserService.getAllPaginated(page, limit);
    return Object.assign(
      super.getOk({
        message: "Users fetched successfully",
        data: UserDTO.list(users),
      }),
      { total }
    );
  }

  // GET SINGLE USER
  @Security("jwt")
  @SuccessResponse("200", "User fetched successfully")
  @Response<ErrorResponse>(404, "User not found")
  @Get("{uid}")
  @Middlewares([authorize()]) // Allows self-access
  async getUserById(@Path() uid: string): Promise<UserResponse> {
    const user = await UserService.getByIdWithRoles(uid);

    return super.getOk({
      message: "User fetch successfully",
      data: UserDTO.single(user),
    });
  }

  // UPDATE USER
  @Security("jwt")
  @Put("{uid}")
  @Middlewares([
    validate_schemas(UserUpdateValidationSchema),
    authorize("update_user"), // Combines self-access + privilege
  ])
  async updateUser(
    @Request() req: ExRequest,
    @Path() uid: string,
    @Body() updateData: UserUpdateRequest
  ): Promise<UserResponse> {
    const currentUserUid = req.user.uid; // or req.user.id depending on your JWT payload

    const sanitized = {
      ...updateData,
      title: updateData.title ?? null,
      phone: updateData.phone ?? null,
      address: updateData.address ?? null,
      avatarUrl: updateData.avatarUrl ?? null,
    };
    const params: UpdateUserParams = {
      ...sanitized,
      dob: sanitized.dob ? new Date(sanitized.dob) : undefined,
    };
    console.log("From Controller:", params);
    const updatedUser = await UserService.update(uid, params, currentUserUid);

    // const serialized = {
    //   ...updatedUser,
    //   dob: updatedUser.dob.toISOString(),
    //   createdAt: updatedUser.createdAt.toISOString(),
    // };

    return super.putOk({
      message: "User updated successfully",
      data: UserDTO.single(updatedUser),
    });
  }

  @Security("jwt")
  @SuccessResponse("200", "Roles updated")
  @Response<UnauthorizedErrorResponse>(401, "Unauthorized – wrong credentials")
  @Response<InternalErrorResponse>(500, "Internal server error")
  // @Patch("{userUid}/role")
  @Patch("{userUid}")
  @Middlewares([
    authorize("override_permissions"), // Combines self-access + privilege
  ])
  async updateRole(
    @Request() req: ExRequest,
    @Path()
    userUid: string,
    @Body() body: RoleUpdateRequest
  ) {
    // Add explicit type conversion
    const roleUids = body.roleUids as string[];
    const updated = await UserService.updateUserRoles(userUid, roleUids);

    return super.patchOk({
      message: "Roles updated successfully",
      data: UserDTO.single(updated),
    });
  }

  @Security("jwt")
  @SuccessResponse("200", "User deletion successful")
  @Response<ErrorResponse>(404, "User not found")
  @Delete("uids")
  @Middlewares([
    authorize("delete_user"), // Combines self-access + privilege
  ])
  async deleteManyUser(
    @Request() req: ExRequest,
    @Body() uids: DeleteUsersRequest
  ): Promise<DeleteUserResponse> {
    const currentUserUid = req.user.uid;

    // console.log("All the Uids", uids);

    await UserService.deleteManyUser(uids, currentUserUid);
    return super.deleteOk({
      message: "User deletion successfull",
      data: {},
    });
  }

  // DELETE USER
  @Security("jwt")
  @SuccessResponse("200", "User deletion successful")
  @Response<ErrorResponse>(404, "User not found")
  @Delete("{uid}")
  @Middlewares([
    authorize("delete_user"), // Combines self-access + privilege
  ])
  async deleteUser(
    @Request() req: ExRequest,
    @Path() uid: string
  ): Promise<DeleteUserResponse> {
    const currentUserUid = req.user.uid;
    await UserService.delete(uid, currentUserUid);
    return super.deleteOk({
      message: "User deletion successfull",
      data: {},
    });
  }
}

// export const UserController = new _UserController();
