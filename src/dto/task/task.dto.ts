import { TaskRequest } from "./TaskRequest.dto";
import { TaskResponseData } from "./TaskResponse.dto";

class TaskDTO {
  single(task: any): TaskResponseData {
    // const TaskSerialized = {
    //   ...task,
    //   startDate: task.startDate?.toISOString(),
    //   endDate: task.endDate?.toISOString(),
    // };
    // return TaskSerialized;

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      priority: task.priority,
      status: task.status,
      startDate: task.startDate?.toISOString() ?? null,
      endDate: task.endDate?.toISOString() ?? null,
      estimatedHours: task.estimatedHours,
      projectId: task.projectId,
      assignedToId: task.assignedToId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}

export default new TaskDTO();
