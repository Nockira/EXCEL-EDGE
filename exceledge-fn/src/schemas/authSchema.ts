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
});
