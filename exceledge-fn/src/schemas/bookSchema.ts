import * as yup from "yup";

export const createBookSchema = yup.object({
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author is required"),
  language: yup
    .string()
    .min(2, "Language must be at least 2 characters")
    .max(50, "Language must be at most 50 characters")
    .required("Language is required"),
  type: yup.string().required("Type is required"),

  coverImageFile: yup
    .mixed<File>()
    .test("fileType", "Please upload an image file", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),

  pdfFile: yup.mixed<File>().when("type", ([type], schema) => {
    return type === "PDF"
      ? schema
          .required("PDF file is required")
          .test("fileType", "Please upload a PDF file", (value) => {
            return value && value.type === "application/pdf";
          })
      : schema.notRequired();
  }),

  videoFile: yup.mixed<File>().when("type", ([type], schema) => {
    return type === "Video"
      ? schema
          .required("Video file is required")
          .test("fileType", "Please upload a video file", (value) => {
            return value && value.type.startsWith("video/");
          })
      : schema.notRequired();
  }),

  audioFile: yup.mixed<File>().when("type", ([type], schema) => {
    return type === "Audio"
      ? schema
          .required("Audio file is required")
          .test("fileType", "Please upload an audio file", (value) => {
            return value && value.type.startsWith("audio/");
          })
      : schema.notRequired();
  }),
});
