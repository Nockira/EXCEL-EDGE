import Joi from "joi";

export const registerUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  secondName: Joi.string().allow("", null),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
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
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").allow("", null),
  dob: Joi.date().max("now").allow("", null).messages({
    "date.max": "Date of birth cannot be in the future",
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
