import { Example } from "tsoa";
import { TaskPriority, TaskStatus } from "./TaskRequest.dto";

export class PatchTaskRequest {
  @Example("Design the dashboard UI")
  name?: string;

  @Example("Create a modern and responsive UI for the admin dashboard")
  description?: string;

  @Example(TaskPriority.LOW)
  priority?: TaskPriority;

  @Example(TaskStatus.TODO)
  status?: TaskStatus;

  @Example("2025-05-10T09:00:00Z")
  startDate?: string;

  @Example("2025-05-15T17:00:00Z")
  endDate?: string;

  @Example(12.5)
  estimatedHours?: number;

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  assignedToUid?: string;

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  projectUid?: string;

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  listUid?: string;
}
