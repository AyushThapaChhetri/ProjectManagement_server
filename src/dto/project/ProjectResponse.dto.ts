import { Example } from "tsoa";

export class ProjectResponse {
  // @Example("Project Created Successfully")
  message!: string;

  @Example({
    id: 12,
    name: "Website Redesign",
    description: "A full redesign of the company website",
    deadline: "2025-06-01T10:00:00.000Z",
    managerId: 5,
    createdAt: "2025-05-03T12:34:56.789Z",
    updatedAt: "2025-05-03T12:34:56.789Z",
  })
  data!: {
    id: number;
    name: string;
    description: string | null;
    deadline: string | null;
    managerId: number | null;
    createdAt: string;
    updatedAt: string;
  };

  @Example(200)
  statusCode!: number;
}
