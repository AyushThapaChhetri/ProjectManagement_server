import { Example } from "tsoa";

export class ProjectRequest {
  @Example("Website Redesign")
  name!: string;

  @Example("A full redesign of the company website")
  description?: string;

  @Example("2025-06-01T10:00:00.000Z")
  deadline?: string; // ISO format

  // @Example(5)
  // managerId!: number; // Although you will override this based on the authenticated user
}
