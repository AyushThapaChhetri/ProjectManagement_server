import { Example } from "tsoa";

export class CreateTodoResponse {
  @Example("Todo Insert Successful")
  message!: string;

  @Example({
    id: "26",
    projectName: "Hero",
    taskName: "Running Down",
    priority: "low",
    progressStatus: "progress",
    startDate: "2025-04-22T12:00:20.160Z",
    endDate: "2025-04-23T12:00:20.160Z",
    hoursTime: 0,
    minutesTime: 0,
    secondsTime: 0,
    userId: 1,
    createdAt: "2025-04-22T12:00:20.160Z",
  })
  data!: {
    id: string;
    projectName: string;
    taskName: string;
    priority: string;
    progressStatus: string;
    startDate?: string;
    endDate?: string;
    hoursTime?: string;
    minutesTime?: string;
    secondsTime?: string;
    userId: number;
    createdAt: string;
  };

  @Example(200)
  statusCode!: number;
}
