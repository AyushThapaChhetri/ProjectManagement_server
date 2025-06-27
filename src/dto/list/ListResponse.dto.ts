import { ApiResponse } from "../../controller/contract/baseController.contract";
import { Example } from "tsoa";

export class ListResponseData {
  @Example("01HXYZABCDEF1234567890")
  uid!: string;

  @Example("In Preview")
  name!: string;

  @Example("abc123-user-uid")
  createdByUid!: string | null;

  @Example("abc456-project-uid")
  projectUid!: string;

  @Example("2025-05-05T12:00:00.000Z")
  createdAt!: string;

  @Example("2025-05-05T14:00:00.000Z")
  updatedAt!: string;
}

export class ListResponse extends ApiResponse<ListResponseData[]> {
  total!: number;
}
