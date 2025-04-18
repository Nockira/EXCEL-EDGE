import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  language: Joi.string().min(2).max(50).required(),
  type: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()).min(1))
    .required(),
  coverImageUrl: Joi.string().uri().optional().allow(null, ""),
  pdfUrl: Joi.string().uri().optional().allow(null, ""),
  audioUrl: Joi.string().uri().optional().allow(null, ""),
  videoUrl: Joi.string().uri().optional().allow(null, ""),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().allow(null, ""),
  author: Joi.string().allow(null, ""),
  language: Joi.string().allow(null, ""),
  type: Joi.optional(),
  coverImageUrl: Joi.string().optional(),
  pdfUrl: Joi.string().optional(),
  audioUrl: Joi.string().optional(),
  videoUrl: Joi.string().optional(),
}).min(1);
