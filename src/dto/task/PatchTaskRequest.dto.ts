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

  @Example(3)
  assignedToId?: number;

  @Example(1)
  projectId?: number;
}
