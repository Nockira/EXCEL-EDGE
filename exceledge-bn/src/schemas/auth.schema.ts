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
