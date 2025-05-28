// src/controller/dto/RoleUpdateRequest.ts

import { Example } from "tsoa";

export class RoleUpdateRequest {
  @Example([
    "c289f43e-89de-42ef-8e1a-35a222b1ac12", // Admin
    "e911ffb6-0f18-4e97-b06f-bf301cba763e", // Project Manager
  ]) // Role IDs
  roleUids!: string[];
}
