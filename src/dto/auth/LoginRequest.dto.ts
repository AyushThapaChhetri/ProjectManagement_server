import { Example } from "tsoa";

export class LoginRequest {
  @Example("hero@gmail.com")
  emailName!: string;

  @Example("lafsU*sdf9dl")
  emailPassword!: string;
}
