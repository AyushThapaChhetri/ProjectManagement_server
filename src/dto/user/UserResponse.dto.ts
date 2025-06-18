// dto/UserResponse.dto.ts

import { Example } from "tsoa";

export class UserResponseData {
  @Example("eb23e109-3f84-4a6f-97b2-cedf2dd16f5e")
  uid!: string;

  @Example("John")
  firstName!: string;

  @Example("Doe")
  lastName!: string;

  @Example("john.doe@example.com")
  email!: string;

  @Example("male")
  gender!: string;

  @Example("1995-06-15")
  dob!: string;

  @Example("123 Street, City")
  address?: string | null;

  @Example("9876543210")
  phone?: string | null;

  @Example("Software Engineer")
  title?: string | null;

  @Example("https://example.com/avatar.jpg")
  avatarUrl?: string | null;

  @Example("2025-04-25T12:34:56.789Z")
  createdAt!: string;

  // Add roles as an array of strings (if a user can have multiple roles)
  @Example(["Admin", "Editor"])
  roles!: string[];
}

export class UserResponse {
  @Example(200)
  statusCode!: number;

  // @Example("User created successfully")
  message!: string;

  data!: UserResponseData;
}
