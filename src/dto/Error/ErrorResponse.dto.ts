// src/dto/common/ErrorResponse.dto.ts
import { Example } from "tsoa";

export class ErrorResponse {
  /**
   * A human-readable message explaining the error
   * @example "Email already exists"
   */
  @Example("Email already exists")
  message!: string;
}
