// src/dto/project/ProjectResponse.dto.ts
import { Example } from "tsoa";

export class ProjectResponse {
  @Example("01HYZ123ABC456DEF789GHIJ")
  uid!: string;

  @Example("Website Redesign")
  name!: string;

  @Example("A full redesign of the company website")
  description!: string | null;

  @Example("2025-06-01T10:00:00.000Z")
  deadline!: string | null;

  @Example("2025-05-03T12:34:56.789Z")
  createdAt!: string;

  @Example("2025-05-03T12:34:56.789Z")
  updatedAt!: string;

  @Example(12)
  managerUid?: string | null;

  @Example(45)
  createdByUid?: string | null;
}
