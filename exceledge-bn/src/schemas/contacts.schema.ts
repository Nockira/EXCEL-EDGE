import Joi from "joi";

export const contactRequestSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().optional().allow(""),
  phone: Joi.string().required(),
  message: Joi.string().required(),
});
