import * as Yup from "yup";

const trimEmptyToUndefined = (originalValue: unknown) => {
  const trimmed =
    typeof originalValue === "string" ? originalValue.trim() : originalValue;
  return trimmed === "" || trimmed === null || trimmed === undefined
    ? undefined
    : trimmed;
};

function string() {
  return Yup.string().transform((_, originalValue) =>
    trimEmptyToUndefined(originalValue)
  );
}
function email(message: string) {
  return Yup.string()
    .email(message ?? "Please Enter Valid Email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please Enter Valid Email"
    );
}

function isoDateString(fieldLabel = "Date") {
  return Yup.string()
    .nullable()
    .test("is-valid-date", `${fieldLabel} is invalid`, (value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    });
}

const BaseYup = {
  ...Yup,
  string,
  email,
  isoDateString,
};
export default BaseYup;
