import * as Yup from "yup";

export const todoValidationSchema = Yup.object({
  projectName: Yup.string().trim().required("Project name is required"),
  taskName: Yup.string().trim().required("Task name is required"),
  priority: Yup.mixed<"low" | "medium" | "high">()
    .oneOf(["low", "medium", "high"])
    .required("Priority is required"),
  progressStatus: Yup.mixed<"todo" | "progress" | "completed">()
    .oneOf(["todo", "progress", "completed"])
    .required("Progress status is required"),
  startDate: Yup.string().datetime().optional(),
  endDate: Yup.string().optional(),
  hoursTime: Yup.number()
    .transform((val, original) => (original === "" ? undefined : val))
    .optional()
    .integer("Hours must be an integer")
    .min(0, "Hours must be at least 0")
    .max(24, "Hours cannot exceed 24"),
  minutesTime: Yup.number()
    .transform((val, original) => (original === "" ? undefined : val))
    .optional()
    .integer("Minutes must be an integer")
    .min(0, "Minutes must be at least 0")
    .max(60, "Minutes cannot exceed 60"),
  secondsTime: Yup.number()
    .transform((val, original) => (original === "" ? undefined : val))
    .optional()
    .integer("Seconds must be an integer")
    .min(0, "Seconds must be at least 0")
    .max(60, "Seconds cannot exceed 60"),
}).test(
  "exclusive-time-format",
  "You must supply *either* a valid startDate/endDate pair (and no hours fields), " +
    "*or* all three hoursTime/minutesTime/secondsTime (and no dates).",
  (value) => {
    if (!value) return false;
    const { startDate, endDate, hoursTime, minutesTime, secondsTime } = value;

    const hasDates =
      typeof startDate === "string" &&
      startDate.trim() !== "" &&
      typeof endDate === "string" &&
      endDate.trim() !== "";

    const hasHours =
      hoursTime != null && minutesTime != null && secondsTime != null;

    if (hasDates) {
      const s = Date.parse(startDate!);
      const e = Date.parse(endDate!);
      if (isNaN(s) || isNaN(e) || s >= e) return false;
      if (hoursTime != null || minutesTime != null || secondsTime != null) {
        return false;
      }
      return true;
    }

    if (hasHours) {
      if (hoursTime! + minutesTime! + secondsTime! <= 0) return false;
      if (
        (startDate != null && startDate.trim() !== "") ||
        (endDate != null && endDate.trim() !== "")
      ) {
        return false;
      }
      return true;
    }

    return false;
  }
);

export const patchTodoValidationSchema = Yup.object({
  projectName: Yup.string().trim(),
  taskName: Yup.string().trim(),
  priority: Yup.mixed<"low" | "medium" | "high">().oneOf([
    "low",
    "medium",
    "high",
  ]),
  progressStatus: Yup.mixed<"todo" | "progress" | "completed">().oneOf([
    "todo",
    "progress",
    "completed",
  ]),
  startDate: Yup.string().datetime().optional(),
  endDate: Yup.string().datetime().optional(),
  hoursTime: Yup.number()
    .transform((val, original) => (original === "" ? undefined : val))
    .integer()
    .min(0)
    .max(24),
  minutesTime: Yup.number()
    .transform((val, original) => (original === "" ? undefined : val))
    .integer()
    .min(0)
    .max(60),
  secondsTime: Yup.number()
    .transform((val, original) => (original === "" ? undefined : val))
    .integer()
    .min(0)
    .max(60),
}).test(
  "exclusive-time-format",
  "If providing dates, both startDate and endDate must be valid and startDate < endDate. " +
    "If providing hours, all three fields must be provided and sum > 0. Cannot provide both dates and hours.",
  (value) => {
    const { startDate, endDate, hoursTime, minutesTime, secondsTime } = value;

    const providingDates = startDate !== undefined || endDate !== undefined;
    const providingHours =
      hoursTime !== undefined ||
      minutesTime !== undefined ||
      secondsTime !== undefined;

    if (providingDates && providingHours) {
      return false;
    }

    if (providingDates) {
      if (startDate === undefined || endDate === undefined) return false;
      const s = Date.parse(startDate);
      const e = Date.parse(endDate);
      if (isNaN(s) || isNaN(e) || s >= e) return false;
    }

    if (providingHours) {
      if (
        hoursTime === undefined ||
        minutesTime === undefined ||
        secondsTime === undefined
      )
        return false;
      if (Number(hoursTime) + Number(minutesTime) + Number(secondsTime) <= 0)
        return false;
    }

    return true;
  }
);
