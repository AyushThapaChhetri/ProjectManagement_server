import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Header,
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
import { Request as ExRequest, Response as ExResponse } from "express";
import BaseController, {
  ApiResponse,
} from "./contract/baseController.contract";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { validate_schemas } from "../middlewares/validationMiddleware";
import {
  createProjectValidationSchema,
  deleteProjectValidationSchema,
  getProjectValidationSchema,
  updateProjectValidationSchema,
} from "./validation/project.validation";
import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
import { ForbiddenErrorResponse } from "../dto/Error/ForbiddenErrorResponse.dto";
import { checkPrivilege } from "@app/middlewares/checkPrivilege";
import { DeleteProjectResponse } from "../dto/project/DeleteProjectResponse.dto";

import { ProjectRequest } from "../dto/project/ProjectRequest.dto";
import { ProjectResponse } from "../dto/project/ProjectResponse.dto";
import { NotFoundErrorResponse } from "../dto/Error/NotFoundErrorResponse.dto";
import { convertUndefinedToNull } from "../libs/normalize/normalize.utils";
import { ProjectDTO } from "../dto/project/project.dto";
import { ProjectService } from "../service/project/project.service";

// Controller
@Security("jwt")
@Response<ValidationErrorResponse>(422, "Validation failed")
@Response<UnauthorizedErrorResponse>(401, "Unauthorized")
@Response<ForbiddenErrorResponse>(403, "Forbidden")
@Response<NotFoundErrorResponse>(404, "Not Found Error")
@Route("api/projects")
@Tags("Projects")
export class ProjectController extends BaseController {
  @SuccessResponse("200", "Project Created Successfully")
  @Middlewares([
    validate_schemas(createProjectValidationSchema, "body"),
    checkPrivilege("create_project"),
  ])
  @Post()
  async create(
    @Request() req: ExRequest,
    @Body() body: ProjectRequest
  ): Promise<ApiResponse<ProjectResponse>> {
    const currentUserUid = req.user.uid;

    console.log("Req body: ", req.body);
    console.log("From Controller");

    //converting underfined to Null
    // const cleaned = convertUndefinedToNull(projectData);
    const projectData = convertUndefinedToNull({
      ...body,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    });

    const project = await ProjectService.create(currentUserUid, projectData);

    return super.postOk({
      message: "Project Created Successfully",
      data: ProjectDTO.single(project),
    });
  }

  @SuccessResponse("200", "Project Retrieved Successfully")
  @Get()
  @Middlewares(checkPrivilege("read_project"))
  async getAll(
    @Request() req: ExRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ) {
    const { projects, total } = await ProjectService.getAllPaginated(
      page,
      limit
    );

    return Object.assign(
      super.getOk({
        message: total ? "Projects fetched successfully" : "No Project found",
        data: projects,
      }),
      { total }
    );
  }

  @SuccessResponse("200", "Project Retrieved Successfully")
  @Middlewares([
    validate_schemas(getProjectValidationSchema, "params"),
    checkPrivilege("read_project"),
  ])
  @Get("{projectUid}")
  public async getById(
    // @Request() req: ExRequest,
    @Path() projectUid: string
  ): Promise<ApiResponse<ProjectResponse>> {
    const project = await ProjectService.getByUid(projectUid);

    return super.getOk({
      message: "Project Retrieved Successfully",
      data: ProjectDTO.single(project),
    });
  }

  @SuccessResponse("200", "Project Updated Successfully")
  @Middlewares([
    validate_schemas(updateProjectValidationSchema, "body"),
    validate_schemas(getProjectValidationSchema, "params"),
    checkPrivilege("update_project"),
  ])
  @Put("{projectUid}")
  public async update(
    @Request() req: ExRequest,
    // req: Request,
    @Path() projectUid: string,
    @Body() body: ProjectRequest
  ): Promise<ApiResponse<ProjectResponse>> {
    const currentUserUid = req.user.uid;
    // const updateData = {
    //   ...body,
    //   deadline: body.deadline ? new Date(body.deadline) : undefined,
    // };

    const updateData = convertUndefinedToNull({
      ...body,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    });

    const updatedProject = await ProjectService.updateProject(
      currentUserUid,
      projectUid,
      updateData
    );

    return super.putOk({
      message: "Project Updated Successfully",
      data: ProjectDTO.single(updatedProject),
    });
  }

  @SuccessResponse("200", "Project Updated Successfully")
  @Middlewares([
    validate_schemas(updateProjectValidationSchema, "body"),
    validate_schemas(getProjectValidationSchema, "params"),
    checkPrivilege("update_project"),
  ])
  @Patch("{projectUid}")
  public async patch(
    @Request() req: ExRequest,
    // req: Request,
    @Path() projectUid: string,
    @Body() body: Partial<ProjectRequest>
  ): Promise<ApiResponse<ProjectResponse>> {
    const currentUserUid = req.user.uid;
    const updateData = {
      ...body,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    };

    const updatedProject = await ProjectService.PatchProject(
      currentUserUid,
      projectUid,
      updateData
    );

    return super.patchOk({
      message: "Project Updated Successfully",
      data: ProjectDTO.single(updatedProject),
    });
  }

  @SuccessResponse("200", "Project Deleted Successfully")
  // forbidden 403
  @Middlewares([
    validate_schemas(deleteProjectValidationSchema, "params"),
    checkPrivilege("delete_project"),
  ])
  @Delete("{projectUid}")
  public async delete(
    @Request() req: ExRequest,
    @Path() projectUid: string
  ): Promise<DeleteProjectResponse> {
    // const userId = request.user.id; // Verify user is authenticated
    await ProjectService.deleteProject(projectUid, req.user);
    return super.deleteOk({
      message: "Project Deleted Successfully",
      data: {},
    });
  }
}
