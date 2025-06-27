import { Request as ExRequest } from "express";
import BaseController from "./contract/baseController.contract";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
import { ForbiddenErrorResponse } from "../dto/Error/ForbiddenErrorResponse.dto";
import { NotFoundErrorResponse } from "../dto/Error/NotFoundErrorResponse.dto";
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
import { validate_schemas } from "../middlewares/validationMiddleware";
import { authorize } from "../middlewares/authorization";
import { ListRequest } from "../dto/list/ListRequest.dto";
import {
  deleteListValidationSchema,
  getListValidationSchema,
  ListValidationSchema,
  updateListValidationSchema,
} from "./validation/list.validation";
import { ListService } from "../service/list/list.service";
import { ListDTO } from "../dto/list/list.dto";
import { PatchListRequest } from "../dto/list/PatchListRequest.dto";
import { ListResponse } from "../dto/list/ListResponse.dto";

@Security("jwt")
@Response<ValidationErrorResponse>(422, "Validation failed")
@Response<UnauthorizedErrorResponse>(401, "Unauthorized")
@Response<ForbiddenErrorResponse>(403, "Forbidden")
@Response<NotFoundErrorResponse>(404, "Not Found Error")
@Route("/api/lists")
@Tags("Lists")
export class ListController extends BaseController {
  @SuccessResponse("200", "List Created Successfully")
  @Middlewares([
    validate_schemas(ListValidationSchema, "body"),
    authorize("create_list"),
  ])
  @Post()
  async create(@Request() req: ExRequest, @Body() body: ListRequest) {
    const currentUser = req.user.uid;
    const list = await ListService.create(currentUser, body);
    return super.postOk({
      message: "List Created Successfully",
      data: ListDTO.single(list),
    });
  }

  @SuccessResponse("200", "List Retrieved Successfully")
  @Get()
  @Middlewares(authorize("read_list"))
  async getAll(
    @Request() req: ExRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<ListResponse> {
    const { lists, total } = await ListService.getAllPaginated(page, limit);

    return Object.assign(
      super.getOk({
        message: total ? "Lists fetched successfully" : "No List found",
        data: ListDTO.list(lists),
      }),
      { total }
    );
  }

  @SuccessResponse("200", "List Retrieved Successfully")
  @Middlewares([
    validate_schemas(getListValidationSchema, "params"),
    authorize("read_list"),
  ])
  @Get("{listUid}")
  public async getByUid(@Path() listUid: string) {
    const list = await ListService.getByUid(listUid);

    return super.getOk({
      message: "List Retrieved Successfully",
      data: ListDTO.single(list),
    });
  }

  @SuccessResponse("200", "List Updated Successfully")
  @Middlewares([
    validate_schemas(updateListValidationSchema, "body"),
    validate_schemas(getListValidationSchema, "params"),
    authorize("update_list"),
  ])
  @Put("{listUid}")
  public async update(
    @Request() req: ExRequest,
    @Path() listUid: string,
    @Body() body: ListRequest
  ) {
    const user = req.user;
    const list = await ListService.updateList(user.uid, listUid, body);

    return super.patchOk({
      message: "List Updated Successfully",
      data: ListDTO.single(list),
    });
  }
  @SuccessResponse("200", "List Updated Successfully")
  @Middlewares([
    validate_schemas(updateListValidationSchema, "body"),
    validate_schemas(getListValidationSchema, "params"),
    authorize("update_list"),
  ])
  @Patch("{listUid}")
  public async patch(
    @Request() req: ExRequest,
    // req: Request,
    @Path() listUid: string,
    @Body() body: PatchListRequest
  ) {
    const user = req.user;
    const list = await ListService.patchList(user.uid, listUid, body);

    return super.putOk({
      message: "List Updated Successfully",
      data: ListDTO.single(list),
    });
  }

  @SuccessResponse("200", "List Deleted Successfully")
  @Middlewares([
    validate_schemas(deleteListValidationSchema, "params"),
    authorize("delete_list"),
  ])
  @Delete("{listUid}")
  public async delete(@Request() request: ExRequest, @Path() listUid: string) {
    await ListService.deleteList(listUid, request.user);
    return super.deleteOk({
      message: "Task Deleted Successfully",
      data: {},
    });
  }
}
