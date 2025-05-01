import { Example } from "tsoa";

export class UnauthorizedErrorResponse {
  @Example("Unauthorized error message")
  error!: string;
}
