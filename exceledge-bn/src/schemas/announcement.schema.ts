import Joi from "joi";
export const createAnnouncementSchema = Joi.object({
  title: Joi.string().required().trim(),
  content: Joi.string().required(),
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim(),
  content: Joi.string(),
}).min(1);
