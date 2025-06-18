import * as yup from "yup";

import BaseYup from "../contract/baseValidator.contract";

const trimEmptyToUndefined = (originalValue: unknown) => {
  const trimmed =
    typeof originalValue === "string" ? originalValue.trim() : originalValue;

  if (trimmed === undefined || trimmed === "" || trimmed === null) {
    return undefined;
  }

  return trimmed;
};

const parseDateSafely = (value: unknown): Date | null => {
  const trimmed = typeof value === "string" ? value.trim() : value;
  const parsed = new Date(trimmed as string);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const UserSignupValidationSchema = BaseYup.object({
  firstName: BaseYup.string()
    .min(2, "First name is too short")
    .max(30, "First name is too long")
    .required("Please enter your first name"),

  lastName: BaseYup.string()
    .min(2, "Last name is too short")
    .max(30, "Last name is too long")
    .required("Please enter your last name"),

  email: BaseYup.string()
    .email("Please enter a valid email")
    .required("Please enter your email"),

  password: BaseYup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Please enter your password"),

  confirmPassword: BaseYup.string()
    .oneOf([BaseYup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  gender: BaseYup.string()
    .oneOf(["male", "female", "other"], "Invalid gender selection")
    .required("Please select your gender"),

  dob: BaseYup.string()
    .required("Please select your date of birth")
    // ↓ now run two tests after the required check:
    .test("is-valid-date", "Invalid date format", (value) => {
      // If value is "", the .required above already caught that,
      // so here we only validate non-empty strings.
      if (!value) return true; // let "required" handle empty
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) {
        return false; // this will trigger "Invalid date format"
      }
      return true;
    })
    .test(
      "not-future-date",
      "Date of birth cannot be in the future",
      (value) => {
        if (!value) return true;
        const parsed = new Date(value);
        // only run this check if parsed is a valid date
        if (isNaN(parsed.getTime())) return true; // skip this test
        return parsed <= new Date();
      }
    ),

  address: BaseYup.string()
    .transform((value, originalValue) => {
      const trimmed = originalValue?.trim?.(); // safely trim if it's a string

      if (trimmed === undefined || trimmed === "" || trimmed === null) {
        return null;
      }

      return trimmed;
    })
    .max(100, "Address is too long")
    .nullable()
    .optional(),

  phone: BaseYup.string()
    .transform((_, original) =>
      typeof original === "string" && original.trim() === ""
        ? undefined
        : original?.trim()
    )
    .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
    .nullable()
    .optional(),

  title: BaseYup.string()
    .transform((value, originalValue) => {
      const trimmed = originalValue?.trim?.(); // safely trim if it's a string

      if (trimmed === undefined || trimmed === "" || trimmed === null) {
        return null;
      }

      return trimmed;
    })
    .max(50, "Title is too long")
    .nullable()
    .optional(),

  avatarUrl: BaseYup.string()
    .transform((value, originalValue) => {
      const trimmed = originalValue?.trim?.(); // safely trim if it's a string

      if (trimmed === undefined || trimmed === "" || trimmed === null) {
        return null;
      }

      return trimmed;
    })
    .url("Avatar must be a valid URL")
    .nullable()
    .optional(),
});

export const UserUpdateValidationSchema = BaseYup.object({
  firstName: BaseYup.string()
    .trim()
    .min(2, "First name is too short")
    .max(30, "First name is too long")
    .optional(),

  lastName: BaseYup.string()
    .trim()
    .min(2, "Last name is too short")
    .max(30, "Last name is too long")
    .optional(),

  email: BaseYup.string().trim().email("Invalid email").optional(),

  gender: BaseYup.string()
    .trim()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .optional(),

  password: BaseYup.string().strip(),
  confirmPassword: BaseYup.string().strip(),

  dob: BaseYup.string()
    .test("is-valid-date", "Invalid date format", (value) => {
      return parseDateSafely(value) !== null;
    })
    .test(
      "not-future-date",
      "Date of birth cannot be in the future",
      (value) => {
        const date = parseDateSafely(value);
        if (!date) return true;
        return date <= new Date();
      }
    )
    .optional(),

  address: BaseYup.string()
    .transform((_, originalValue) => trimEmptyToUndefined(originalValue))
    .max(100, "Address is too long")
    .optional(),

  phone: BaseYup.string()
    .transform((_, originalValue) => trimEmptyToUndefined(originalValue))
    .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number")
    .optional(),

  title: BaseYup.string()
    .transform((_, originalValue) => trimEmptyToUndefined(originalValue))
    .max(50, "Title is too long")
    .optional(),

  avatarUrl: BaseYup.string()
    .transform((_, originalValue) => trimEmptyToUndefined(originalValue))
    .url("Avatar must be a valid URL")
    .optional(),
});
