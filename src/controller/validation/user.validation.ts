import * as yup from "yup";

import BaseYup from "../contract/baseValidator.contract";

export const UserSignupValidationSchema = BaseYup.object({
  firstName: BaseYup.string()
    .min(2, "First name is too short")
    .max(30, "First name is too long")
    .required("Please enter your first name"),

  lastName: BaseYup.string()
    .min(2, "Last name is too short")
    .max(30, "Last name is too long")
    .required("Please enter your last name"),

  emailName: BaseYup.string()
    .email("Please enter a valid email")
    .required("Please enter your email"),

  emailPassword: BaseYup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Please enter your password"),

  emailConfirmPassword: BaseYup.string()
    .oneOf([BaseYup.ref("emailPassword")], "Passwords must match")
    .required("Please confirm your password"),

  gender: BaseYup.string()
    .oneOf(["male", "female", "other"], "Invalid gender selection")
    .required("Please select your gender"),

  emailDob: BaseYup.date()
    .required("Please select your date of birth")
    .max(new Date(), "Date of birth cannot be in the future"),

  address: BaseYup.string().max(100, "Address is too long").optional(),

  phone: BaseYup.string()
    .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
    .optional(),

  title: BaseYup.string().max(50, "Title is too long").optional(),

  avatarUrl: BaseYup.string().url("Avatar must be a valid URL").optional(),
});

export const userUpdateSchema = BaseYup.object({
  firstName: BaseYup.string()
    .max(50, "First name must be at most 50 characters")
    .optional(),

  lastName: BaseYup.string()
    .max(50, "Last name must be at most 50 characters")
    .optional(),

  gender: BaseYup.string()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .optional(),

  dob: BaseYup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),

  address: BaseYup.string()
    .nullable()
    .max(100, "Address is too long")
    .optional(),

  phone: BaseYup.string()
    .nullable()
    .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
    .optional(),

  title: BaseYup.string().nullable().max(50, "Title is too long").optional(),

  avatarUrl: BaseYup.string()
    .nullable()
    .url("Avatar must be a valid URL")
    .optional(),
});
