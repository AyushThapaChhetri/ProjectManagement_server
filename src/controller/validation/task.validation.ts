import { TaskPriority, TaskStatus } from "../../dto/task/TaskRequest.dto";
import * as Yup from "yup";

export const TaskValidationSchema = Yup.object({
  projectId: Yup.number().required("Project ID is required"),

  name: Yup.string()
    .required("Task name is required")
    .min(3, "Name must be at least 3 characters"),

  description: Yup.string().nullable(),

  priority: Yup.mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority), "Priority must be low, medium, or high")
    .required(),

  status: Yup.mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .required(),

  startDate: Yup.date().nullable().typeError("Start Date must be a valid date"),

  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date can't be before start date")
    .typeError("End Date must be a valid date"),

  estimatedHours: Yup.number()
    .nullable()
    .positive("Estimated hours must be a positive number")
    .typeError("Estimated hours must be a number"),

  assignedToId: Yup.number()
    .nullable()
    .typeError("AssignedToId must be a number"),
});

// get Project by Id
export const getTaskValidationSchema = Yup.object({
  taskId: Yup.number().required().positive().integer(),
});

// Validation Schema for Delete Project
export const deleteTaskValidationSchema = Yup.object({
  projectId: Yup.number().required().positive().integer(),
});

export const updateTaskValidationSchema = Yup.object({
  projectId: Yup.number().optional().typeError("projectId must be a number"),

  name: Yup.string().min(3, "Name must be at least 3 characters").optional(),

  description: Yup.string().nullable().optional(),

  priority: Yup.mixed<TaskPriority>()
    .oneOf(
      Object.values(TaskPriority),
      `Priority must be one of: ${Object.values(TaskPriority).join(", ")}`
    )
    .optional(),

  status: Yup.mixed<TaskStatus>()
    .oneOf(
      Object.values(TaskStatus),
      `Status must be one of: ${Object.values(TaskStatus).join(", ")}`
    )
    .optional(),

  startDate: Yup.date()
    .nullable()
    .typeError("startDate must be a valid date")
    .optional(),

  endDate: Yup.date()
    .nullable()
    .typeError("endDate must be a valid date")
    .when("startDate", (startDate, schema) => {
      return startDate
        ? schema.min(startDate, "endDate can’t be before startDate")
        : schema;
    })
    .optional(),

  estimatedHours: Yup.number()
    .nullable()
    .positive("estimatedHours must be a positive number")
    .typeError("estimatedHours must be a number")
    .optional(),

  assignedToId: Yup.number()
    .nullable()
    .typeError("assignedToId must be a number")
    .optional(),
});
