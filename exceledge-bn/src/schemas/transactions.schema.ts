import Joi from "joi";

// Create transaction validation schema
export const createTransactionSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "User ID must be a string",
    "string.uuid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),

  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required",
  }),

  method: Joi.string().valid("MTN", "AIRTEL").required().messages({
    "string.base": "Payment method must be a string",
    "any.only": "Payment method must be either MTN or AIRTEL",
    "any.required": "Payment method is required",
  }),

  duration: Joi.number().integer().positive().required().messages({
    "number.base": "Duration must be a number",
    "number.integer": "Duration must be an integer",
    "number.positive": "Duration must be positive",
    "any.required": "Duration is required",
  }),

  service: Joi.string().required().messages({
    "string.base": "Service must be a string",
    "any.required": "Service is required",
  }),
});

// Update transaction validation schema
export const updateTransactionSchema = Joi.object({
  status: Joi.string().valid("PENDING", "COMPLETED", "FAILED").messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either PENDING, COMPLETED, or FAILED",
  }),

  amount: Joi.number().positive().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
  }),

  method: Joi.string().valid("MTN", "AIRTEL").messages({
    "string.base": "Payment method must be a string",
    "any.only": "Payment method must be either MTN or AIRTEL",
  }),

  duration: Joi.number().integer().positive().messages({
    "number.base": "Duration must be a number",
    "number.integer": "Duration must be an integer",
    "number.positive": "Duration must be positive",
  }),

  service: Joi.string().messages({
    "string.base": "Service must be a string",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Update payment status validation schema
export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "COMPLETED", "FAILED")
    .required()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be either PENDING, COMPLETED, or FAILED",
      "any.required": "Status is required",
    }),
});
