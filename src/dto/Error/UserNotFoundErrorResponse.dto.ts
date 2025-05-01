import { Example } from "tsoa";

export class UserNotFoundErrorResponse {
  @Example("User not found")
  error!: string;
}
