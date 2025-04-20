import Joi from "joi";

export const registerUserSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters long",
    "any.required": "First name is required",
  }),
  secondName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters long",
    "any.required": "Last name is required",
  }),
});

export const googleAuthSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Google token is required",
  }),
});
const phoneNumberPattern = /^\+?[0-9]{10,15}$/;

export const loginSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
  email: Joi.string().email().messages({
    "string.email": "Invalid email format",
  }),
  phone: Joi.string().pattern(phoneNumberPattern).messages({
    "string.pattern.base": "Invalid phone number",
  }),
})
  .or("email", "phone")
  .messages({
    "object.missing": "Either email or phone number is required",
  });

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).trim(),
  secondName: Joi.string().min(2).max(50).trim().allow(null, ""),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message("Phone number must be 10 digits"),
  password: Joi.string().min(6).max(30),
  gender: Joi.string().valid("Male", "Female", "Other"),
  dob: Joi.date().iso(),
  role: Joi.string().valid("USER", "STAFF", "ADMIN", "PARTNER"),
}).min(1);
