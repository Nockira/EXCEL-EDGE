import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone is required")
    .test(
      "phone",
      "Must be a valid phone number",
      (value) =>
        !!value &&
        (yup.string().email().isValidSync(value) ||
          yup
            .string()
            .matches(/^\d+$/, "Invalid phone number")
            .isValidSync(value))
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required"),
});

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  secondName: yup.string().optional(),
  email: yup.string().email("Invalid email format").optional(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE"], "Invalid gender")
    .required("Gender is required"),
  dob: yup
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
});
