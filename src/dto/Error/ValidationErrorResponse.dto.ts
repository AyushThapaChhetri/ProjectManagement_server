// src/dto/Error/ValidationErrorResponse.dto.ts
import { Example } from "tsoa";

export class FieldError {
  @Example("fieldName")
  field!: string;

  @Example("Validation error message")
  message!: string;
}

export class ValidationErrorResponse {
  @Example("Validation failed")
  message!: string;

  /**
   * Detailed list of field errors
   */
  errors!: FieldError[];
}
