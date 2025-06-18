import BaseYup from "../contract/baseValidator.contract";

export const signupValidationSchema = BaseYup.object({
  firstName: BaseYup.string()
    .min(2, "First name is too short")
    .max(30, "First name is too long")
    .required("Please enter your first name"),

  lastName: BaseYup.string()
    .min(2, "Last name is too short")
    .max(30, "Last name is too long")
    .required("Please enter your last name"),

  email: BaseYup.email("Please Enter Valid Email").required(
    "Please Enter Email"
  ),

  password: BaseYup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least 1 lower case letter") // for lowercase letters
    .matches(/[A-Z]/, "Password must contain at least 1 upper case letter") // for uppercase letters
    .matches(/\d/, "Password must contain at least 1 number") // for numbers
    .matches(/[\W_]/, "Password must contain at least 1 special character") // for special characters
    .required("Please Enter Password"),

  confirmPassword: BaseYup.string()
    .oneOf([BaseYup.ref("password")], "Password must match")
    .required("Enter Confirm Password"),

  gender: BaseYup.string()
    .oneOf(["male", "female", "other"], "Invalid gender selection")
    .required("Please Enter Your Gender"),

  dob: BaseYup.date()
    .required("Please select your date of birth")
    .max(new Date(), "Date of birth cannot be in the future"),

  address: BaseYup.string()
    .trim()
    .transform((value) => (value === "" || value === undefined ? null : value))
    .nullable()
    .optional(),

  phone: BaseYup.string()
    .trim()
    .transform((value) => (value === "" || value === undefined ? null : value))
    .nullable()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional(),

  title: BaseYup.string()
    .trim()
    .transform((value) => (value === "" || value === undefined ? null : value))
    .nullable()
    .optional(),
});

export const loginValidationSchema = BaseYup.object({
  email: BaseYup.email("Please Enter Valid Email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please Enter Valid Email"
    )
    .required("Please Enter Email"),

  password: BaseYup.string().required("Please Enter Password"),

  // emailRemember: BaseYup.bool(),
});

export const refreshTokenValidationSchema = BaseYup.object({
  refreshToken: BaseYup.string().required("Refresh token is required"),
});
