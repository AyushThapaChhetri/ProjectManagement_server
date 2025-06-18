import { Example } from "tsoa";

export class DeleteUserResponse {
  @Example("User deleted successfully")
  message!: string;

  @Example({})
  data!: Record<string, never>;

  @Example(200)
  statusCode!: number;
}
