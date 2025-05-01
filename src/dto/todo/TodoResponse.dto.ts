import { Example } from "tsoa";

export class TodoItem {
  @Example("26")
  id!: string;

  @Example("Build a Cup")
  projectName!: string;

  @Example("Design the cup")
  taskName!: string;

  @Example("low")
  priority!: string;

  @Example("todo")
  progressStatus!: string;

  @Example("")
  startDate!: string;

  @Example("")
  endDate!: string;

  @Example("3")
  hoursTime!: string;

  @Example("2")
  minutesTime!: string;

  @Example("4")
  secondsTime!: string;

  @Example(1)
  userId!: number;

  @Example("2025-04-22T12:00:20.160Z")
  createdAt!: string;
}

export class TodosResponse {
  @Example(200)
  statusCode!: number;

  @Example("Todos retrieved successfully")
  message!: string;

  data!: TodoItem[];
}
