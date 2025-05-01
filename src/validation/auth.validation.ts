import * as Yup from "yup";

export const signupValidationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Too short")
    .max(30, "Too long")
    .required("Please Enter Name"),
  emailName: Yup.string()
    .email("Please Enter Valid Email")
    .required("Please Enter Email"),
  emailPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least 1 lower case letter") // for lowercase letters
    .matches(/[A-Z]/, "Password must contain at least 1 upper case letter") // for uppercase letters
    .matches(/\d/, "Password must contain at least 1 number") // for numbers
    .matches(/[\W_]/, "Password must contain at least 1 special character") // for special characters
    .required("Please Enter Password"),
  emailConfirmPassword: Yup.string()
    .oneOf([Yup.ref("emailPassword")], "Password must match")
    .required("Enter Confirm Password"),
  gender: Yup.string().required("Please Enter Your Gender"),
  emailDob: Yup.date()
    .required("Please select your date of birth")
    .max(new Date(), "Date of birth cannot be in the future"),
});
