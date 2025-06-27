import { Example } from "tsoa";

export class ProjectRequest {
  @Example("Website Redesign")
  name!: string;

  @Example("A full redesign of the company website")
  description?: string;

  @Example("2025-06-01T10:00:00.000Z")
  deadline?: string; // ISO format

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  managerUid?: string; // ISO format
}
