import * as Yup from "yup";
function email(message: string) {
  return Yup.string()
    .email(message ?? "Please Enter Valid Email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please Enter Valid Email"
    );
}
const BaseYup = {
  ...Yup,
  email,
};
export default BaseYup;
