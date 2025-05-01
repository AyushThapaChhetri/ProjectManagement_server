import { Example } from "tsoa";

// export interface IRecordOfAny {
//   [key: string]: any;
// }

export class LogoutResponse {
  @Example("Logged out successfully")
  message!: string;

  @Example({})
  data!: Record<string, never>;

  @Example(200)
  statusCode!: number;
}
