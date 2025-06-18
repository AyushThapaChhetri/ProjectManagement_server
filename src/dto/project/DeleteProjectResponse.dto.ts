import { Example } from "tsoa";

export class DeleteProjectResponse {
  @Example("Todo deleted successfully")
  message!: string;

  @Example({})
  data!: Record<string, never>;

  @Example(200)
  statusCode!: number;
}
