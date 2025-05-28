import { Example } from "tsoa";

export class LoginRequest {
  @Example("hero@gmail.com")
  email!: string;

  @Example("lafsU*sdf9dl")
  password!: string;
}
