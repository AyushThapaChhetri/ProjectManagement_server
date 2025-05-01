// src/dto/Error/BadRequestErrorResponse.dto.ts
import { Example } from "tsoa";

export class BadRequestErrorResponse {
  @Example("Invalid input")
  message!: string;
}
