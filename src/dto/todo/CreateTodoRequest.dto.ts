import { Example } from "tsoa";

export class CreateTodoRequest {
  @Example("My Project")
  projectName!: string;

  @Example("Do laundry")
  taskName!: string;

  @Example("medium")
  priority!: "low" | "medium" | "high";

  @Example("todo")
  progressStatus!: "todo" | "progress" | "completed";

  @Example("2025-04-22T12:00:20.160Z")
  startDate?: string;

  @Example("2025-04-23T12:00:20.160Z")
  endDate?: string;

  @Example("") // hours branch
  hoursTime?: string;

  @Example("")
  minutesTime?: string;

  @Example("")
  secondsTime?: string;
}
