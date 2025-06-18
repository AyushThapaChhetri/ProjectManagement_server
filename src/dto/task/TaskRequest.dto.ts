import { Example } from "tsoa";

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskStatus {
  TODO = "todo",
  PROGRESS = "progress",
  COMPLETED = "completed",
}

export class TaskRequest {
  @Example("Design the dashboard UI")
  name!: string; //! will be assigned before use

  @Example("Create a modern and responsive UI for the admin dashboard")
  description?: string;

  @Example(TaskPriority.LOW)
  priority: TaskPriority; // Use literal types or enums

  @Example(TaskStatus.TODO)
  status: TaskStatus;

  @Example("2025-05-10T09:00:00Z")
  startDate?: string;

  @Example("2025-05-15T17:00:00Z")
  endDate?: string;

  @Example(12.5)
  estimatedHours?: number;

  @Example(3)
  assignedToId?: number;

  @Example(1)
  projectId!: number;
}
