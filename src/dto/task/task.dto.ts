// import { TaskResponseData } from "./TaskResponse.dto";

// class TaskDTO {
//   single(task: any): TaskResponseData {
//     return {
//       uid: task.uid,
//       name: task.name,
//       description: task.description,
//       priority: task.priority,
//       status: task.status,
//       startDate: task.startDate?.toISOString() ?? null,
//       endDate: task.endDate?.toISOString() ?? null,
//       estimatedHours: task.estimatedHours,
//       projectUid: task.projectUid,
//       assignedToUid: task.assignedToUid,
//       createdByUid: task.createdByUid,
//       createdAt: task.createdAt.toISOString(),
//       updatedAt: task.updatedAt.toISOString(),
//     };
//   }
// }

// export default new TaskDTO();

// src/dto/task/TaskDTO.ts
import { TaskPriority, TaskStatus } from "./TaskRequest.dto";
import { TaskResponseData } from "./TaskResponse.dto";

type RawOrJoinedTask = {
  uid: string;
  name: string;
  description: string | null;
  priority: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  estimatedHours: number | null;
  createdAt: Date;
  updatedAt: Date;
  project?: { uid: string };
  assignedTo?: { uid: string };
  createdBy?: { uid: string };
  projectUid?: string;
  assignedToUid?: string;
  createdByUid?: string;
};

class TaskDTO {
  single(task: RawOrJoinedTask): TaskResponseData {
    return {
      uid: task.uid,
      name: task.name,
      description: task.description,
      priority: task.priority,
      status: task.status,
      startDate: task.startDate?.toISOString() ?? null,
      endDate: task.endDate?.toISOString() ?? null,
      estimatedHours: task.estimatedHours,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      projectUid: task.project?.uid ?? task.projectUid ?? "",
      assignedToUid: task.assignedTo?.uid ?? task.assignedToUid ?? "",
      createdByUid: task.createdBy?.uid ?? task.createdByUid ?? "",
    };
  }

  list(tasks: RawOrJoinedTask[]): TaskResponseData[] {
    return tasks.map((t) => this.single(t));
  }
}

export default new TaskDTO();
