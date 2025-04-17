import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadBookAssets = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
  { name: "audio", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
