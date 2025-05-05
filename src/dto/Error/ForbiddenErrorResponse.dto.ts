import { Example } from "tsoa";

export class ForbiddenErrorResponse {
  @Example("Forbidden error message")
  error!: string;
}
