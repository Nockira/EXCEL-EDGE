import * as yup from "yup";

export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s'-]+$/, "Name must only contain letters")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email address"),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +250788123456)"
    ),

  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
});
