import { Example } from "tsoa";

export class NotFoundErrorResponse {
  @Example("User not found")
  error!: string;
}
