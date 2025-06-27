import * as Yup from "yup";
import BaseYup from "../contract/baseValidator.contract";

// Validation Schema for Create Project
export const createProjectValidationSchema = Yup.object({
  name: BaseYup.string().required("Project name is required"),

  description: BaseYup.string().nullable().optional(),

  // We now expect an ISO-date string, not a Date object
  deadline: BaseYup.isoDateString("Deadline").optional(),
  managerUid: Yup.string().optional(),
});

// get Project by Id
export const getProjectValidationSchema = Yup.object({
  projectUid: BaseYup.string().required(),
});

// Update Project
export const updateProjectValidationSchema = Yup.object({
  name: BaseYup.string()
    .min(3, "Name must be at least 3 characters")
    .optional(),

  description: BaseYup.string().nullable().optional(),

  deadline: BaseYup.isoDateString("Deadline").optional(),
});

// Validation Schema for Delete Project
export const deleteProjectValidationSchema = Yup.object({
  projectUid: BaseYup.string().required(),
});
