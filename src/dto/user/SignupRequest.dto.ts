import { Example } from "tsoa";

export class SignupRequest {
  // @Example("hero")
  // fullName!: string;
  @Example("hero")
  firstName!: string;

  @Example("hero")
  lastName!: string;

  @Example("hero@gmail.com")
  email!: string;

  @Example("lafsU*sdf9dl")
  password!: string;

  @Example("lafsU*sdf9dl")
  confirmPassword!: string;

  @Example("male")
  gender!: "male" | "female" | "other";

  @Example("2025-03-05")
  dob!: string;

  @Example("123 Street, City")
  // address?: string;
  address?: string | null;

  @Example("9876543210")
  // phone?: string;
  phone?: string | null;

  @Example("Software Engineer")
  // title?: string;
  title?: string | null;

  @Example("https://example.com/avatar.jpg")
  // avatarUrl?: string;
  avatarUrl?: string | null;
}
