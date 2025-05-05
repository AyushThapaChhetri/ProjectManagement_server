import { ApiResponse } from "../../controller/contract/baseController.contract";
import { UserResponseData } from "./UserResponse.dto";

export interface UserListResponse extends ApiResponse<UserResponseData[]> {
  total: number;
}
