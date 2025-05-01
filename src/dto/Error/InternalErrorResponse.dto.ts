import { Example } from "tsoa";

export class InternalErrorResponse {
  @Example("Internal server error")
  message!: string;
}
