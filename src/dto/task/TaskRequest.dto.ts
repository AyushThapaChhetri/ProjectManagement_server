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

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  assignedToUid?: string;

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  projectUid!: string;

  @Example("c289f43e-89de-42ef-8e1a-35a222d1ac12")
  listUid!: string;
}
