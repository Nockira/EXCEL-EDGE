import { Request as ExpressRequest, Response } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  filterBooks,
} from "../services/book.service";
import cloudinary from "../configs/cloudinary";
import { Readable } from "stream";
import { UploadApiResponse } from "cloudinary";
import { prisma } from "../utils/prisma.service";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer;
}

interface BookRequest extends Omit<ExpressRequest, "files"> {
  files?: {
    [fieldname: string]: MulterFile[] | undefined;
  };
}
const uploadToCloudinary = (
  file: MulterFile,
  resourceType: "image" | "video" | "raw" | "auto"
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error: any, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(error);
        }
        resolve(result?.secure_url || null);
      }
    );
    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);
    fileStream.pipe(uploadStream);
  });
};

export const create = async (
  req: BookRequest,
  res: Response
): Promise<void> => {
  const user: any = req.user;
  try {
    // Upload files to Cloudinary if they exist
    const coverImageUrl = req.files?.coverImage?.[0]
      ? await uploadToCloudinary(req.files.coverImage[0], "image")
      : null;

    const pdfUrl = req.files?.pdf?.[0]
      ? await uploadToCloudinary(req.files.pdf[0], "raw")
      : null;

    const audioUrl = req.files?.audio?.[0]
      ? await uploadToCloudinary(req.files.audio[0], "video")
      : null;

    const videoUrl = req.files?.video?.[0]
      ? await uploadToCloudinary(req.files.video[0], "video")
      : null;

    const bookData = {
      ...req.body,
      creatorId: user.id,
      coverImageUrl,
      pdfUrl,
      audioUrl,
      videoUrl,
    };

    const book = await createBook(bookData);
    res.status(201).json(book);
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const findAll = async (
  req: ExpressRequest,
  res: Response
): Promise<void> => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const findOne = async (
  req: ExpressRequest,
  res: Response
): Promise<any> => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const update = async (req: BookRequest, res: Response) => {
  try {
    const existingBook = await getBookById(req.params.id);
    if (!existingBook) {
      res.status(404).json({ message: "Book not found" });
    } else {
      const coverImageUrl = req.files?.coverImage?.[0]
        ? await uploadToCloudinary(req.files.coverImage[0], "image")
        : existingBook.coverImageUrl;

      const pdfUrl = req.files?.pdf?.[0]
        ? await uploadToCloudinary(req.files.pdf[0], "raw")
        : existingBook.pdfUrl;

      const audioUrl = req.files?.audio?.[0]
        ? await uploadToCloudinary(req.files.audio[0], "video")
        : existingBook.audioUrl;

      const videoUrl = req.files?.video?.[0]
        ? await uploadToCloudinary(req.files.video[0], "video")
        : existingBook.videoUrl;

      const bookData = {
        ...req.body,
        coverImageUrl,
        pdfUrl,
        audioUrl,
        videoUrl,
      };

      const book = await updateBook(req.params.id, bookData);
      res.status(200).json(book);
    }
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const remove = async (req: ExpressRequest, res: Response) => {
  try {
    await deleteBook(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const search = async (req: ExpressRequest, res: Response) => {
  try {
    const { title, author, language, format } = req.query;
    const books = await filterBooks({
      title: typeof title === "string" ? title : undefined,
      author: typeof author === "string" ? author : undefined,
      language: typeof language === "string" ? language : undefined,
      format: typeof format === "string" ? format : undefined,
    });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};
