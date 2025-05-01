import { Example } from "tsoa";

export class SignupRequest {
  // @Example("hero")
  // fullName!: string;
  @Example("hero")
  firstName!: string;

  @Example("hero")
  lastName!: string;

  @Example("hero@gmail.com")
  emailName!: string;

  @Example("lafsU*sdf9dl")
  emailPassword!: string;

  @Example("lafsU*sdf9dl")
  emailConfirmPassword!: string;

  @Example("male")
  gender!: "male" | "female" | "other";

  @Example("2025-03-05")
  emailDob!: string;

  @Example("123 Street, City")
  address?: string;

  @Example("9876543210")
  phone?: string;

  @Example("Software Engineer")
  title?: string;

  @Example("https://example.com/avatar.jpg")
  avatarUrl?: string;
}
