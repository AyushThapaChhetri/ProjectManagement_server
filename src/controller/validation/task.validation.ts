import { TaskPriority, TaskStatus } from "../../dto/task/TaskRequest.dto";
import * as Yup from "yup";
import BaseYup from "../contract/baseValidator.contract";

export const TaskValidationSchema = BaseYup.object({
  projectUid: BaseYup.string().required("Project UUID is required"),

  listUid: BaseYup.string().required("List UUID is required"),

  name: BaseYup.string()
    .required("Task name is required")
    .min(3, "Name must be at least 3 characters"),

  description: BaseYup.string().nullable().optional(),

  priority: BaseYup.mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority), "Priority must be low, medium, or high")
    .required(),

  status: BaseYup.mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .required(),

  startDate: BaseYup.isoDateString("Start date"),

  endDate: BaseYup.isoDateString("End date").test(
    "is-after-start",
    "End date can’t be before start date",
    function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }
  ),

  estimatedHours: BaseYup.number()
    .nullable()
    .positive("Estimated hours must be a positive number")
    .typeError("Estimated hours must be a number")
    .optional(),

  assignedToUid: BaseYup.string()
    .nullable()
    .typeError("AssignedToUid must be a string")
    .optional(),
});

// get Task by Id
export const getTaskValidationSchema = Yup.object({
  taskUid: BaseYup.string().required(),
});

// Validation Schema for Delete Task
export const deleteTaskValidationSchema = Yup.object({
  taskUid: BaseYup.string().required(),
});

export const updateTaskValidationSchema = BaseYup.object({
  projectUid: BaseYup.string()
    .typeError("Project UID must be a string")
    .optional(),

  listUid: BaseYup.string().typeError("List UID must be a string").optional(),

  name: BaseYup.string()
    .min(3, "Name must be at least 3 characters")
    .optional(),

  description: BaseYup.string().nullable().optional(),

  priority: BaseYup.mixed<TaskPriority>()
    .oneOf(
      Object.values(TaskPriority),
      `Priority must be one of: ${Object.values(TaskPriority).join(", ")}`
    )
    .optional(),

  status: BaseYup.mixed<TaskStatus>()
    .oneOf(
      Object.values(TaskStatus),
      `Status must be one of: ${Object.values(TaskStatus).join(", ")}`
    )
    .optional(),

  startDate: BaseYup.isoDateString("Start date"),

  endDate: BaseYup.isoDateString("End date").test(
    "is-after-start",
    "End date can’t be before start date",
    function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }
  ),

  estimatedHours: BaseYup.number()
    .nullable()
    .positive("Estimated hours must be a positive number")
    .typeError("Estimated hours must be a number")
    .optional(),

  assignedToUid: BaseYup.string()
    .nullable()
    .typeError("AssignedToUid must be a string")
    .optional(),
});
