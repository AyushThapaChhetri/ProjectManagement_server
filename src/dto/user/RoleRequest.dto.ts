// src/controller/dto/RoleUpdateRequest.ts

import { Example } from "tsoa";

export class RoleUpdateRequest {
  @Example([1, 2]) // Role IDs
  roleIds!: number[];
}
