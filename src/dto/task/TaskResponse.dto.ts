// src/dto/task/TaskResponse.dto.ts
import { Example } from "tsoa";
import { TaskPriority, TaskStatus } from "./TaskRequest.dto";

export class TaskResponseData {
  @Example("01HYZ123ABC456DEF789GHIJ")
  uid!: string;

  @Example("Design UI")
  name!: string;

  @Example("Design the dashboard UI for admin panel.")
  description?: string | null;

  @Example(TaskPriority.LOW)
  priority: string;

  @Example(TaskStatus.TODO)
  status: string;

  @Example("2025-05-06T10:00:00.000Z")
  startDate?: string | null;

  @Example("2025-05-10T10:00:00.000Z")
  endDate?: string | null;

  @Example(12.5)
  estimatedHours?: number | null;

  @Example("01HXPROJUID456XYZABC7890")
  projectUid!: string;

  @Example("01HXUSERUID456XYZABC7890")
  assignedToUid?: string | null;

  @Example("abc123-user-uid")
  createdByUid!: string;

  @Example("2025-05-05T12:00:00.000Z")
  createdAt!: string;

  @Example("2025-05-05T14:00:00.000Z")
  updatedAt!: string;
}
