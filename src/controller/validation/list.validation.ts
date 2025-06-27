import * as Yup from "yup";
import BaseYup from "../contract/baseValidator.contract";

export const ListValidationSchema = BaseYup.object({
  projectUid: BaseYup.string().required("Project UUID is required"),
  name: BaseYup.string()
    .required("List name is required")
    .min(3, "Name must be at least 3 characters"),
});

// get List by Id
export const getListValidationSchema = Yup.object({
  listUid: BaseYup.string().required(),
});

export const updateListValidationSchema = BaseYup.object({
  projectUid: BaseYup.string()
    .typeError("Project UID must be a string")
    .optional(),
  name: BaseYup.string()
    .min(3, "Name must be at least 3 characters")
    .optional(),
});

// Validation Schema for Delete List
export const deleteListValidationSchema = Yup.object({
  projectUid: BaseYup.string().required(),
});
