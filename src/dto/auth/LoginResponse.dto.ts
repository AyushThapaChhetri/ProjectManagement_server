// src/dto/user/LoginResponse.dto.ts
import { Example } from "tsoa";
import { UserResponseData } from ".././user/UserResponse.dto";

export class LoginResponseData {
  @Example({
    fullName: "hero",
    email: "hero@gmail.com",
    gender: "male",
    dob: "2025-03-05T00:00:00.000Z",
    createdAt: "2025-04-25T12:34:56.789Z",
  })
  user!: UserResponseData;

  @Example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  accessToken!: string;

  @Example("60c3bf5ccbbbfdbf5dc9ec94ecedada6b...")
  refreshToken!: string;
}

export class LoginResponse {
  @Example(200)
  statusCode!: number;

  @Example("Login successful")
  message!: string;

  data!: LoginResponseData;
}
