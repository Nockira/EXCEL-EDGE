import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  language: Joi.string().min(2).max(50).required(),
  coverImageUrl: Joi.string().uri().optional().allow(null, ""),
  pdfUrl: Joi.string().uri().optional().allow(null, ""),
  audioUrl: Joi.string().uri().optional().allow(null, ""),
  videoUrl: Joi.string().uri().optional().allow(null, ""),
});

export const updateBookSchema = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  language: Joi.string().min(2).max(50),
  coverImageUrl: Joi.string().uri().allow(null, ""),
  pdfUrl: Joi.string().uri().allow(null, ""),
  audioUrl: Joi.string().uri().allow(null, ""),
  videoUrl: Joi.string().uri().allow(null, ""),
}).min(1);
