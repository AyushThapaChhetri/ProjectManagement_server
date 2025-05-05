import * as Yup from "yup";

// Validation Schema for Create Project
export const createProjectValidationSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().optional(),
  deadline: Yup.date()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : new Date(originalValue)
    )
    .typeError("Deadline must be a valid ISO date"),
  // managerId: Yup.number().required().positive().integer(),
});

// get Project by Id
export const getProjectValidationSchema = Yup.object({
  projectId: Yup.number().required().positive().integer(),
});

// Update Project
export const updateProjectValidationSchema = Yup.object({
  name: Yup.string().optional(),
  description: Yup.string().nullable().optional(),
  deadline: Yup.date()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : new Date(originalValue)
    )
    .optional(),
});

// Validation Schema for Delete Project
export const deleteProjectValidationSchema = Yup.object({
  projectId: Yup.number().required().positive().integer(),
});
