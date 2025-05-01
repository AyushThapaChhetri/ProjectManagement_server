// src/dto/todo/UpdateTodoRequest.dto.ts
import { Example } from "tsoa";

export class UpdateTodoRequest {
  @Example("New project name")
  projectName?: string;

  @Example("New task name")
  taskName?: string;

  @Example("low")
  priority?: "low" | "medium" | "high";

  @Example("progress")
  progressStatus?: "todo" | "progress" | "completed";

  @Example("2025-04-22T12:00:20.160Z")
  startDate?: string;

  @Example("2025-04-23T12:00:20.160Z")
  endDate?: string;

  @Example("3")
  hoursTime?: string;

  @Example("2")
  minutesTime?: string;

  @Example("4")
  secondsTime?: string;
}
