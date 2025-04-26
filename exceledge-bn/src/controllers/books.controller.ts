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
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  stream: Readable;
}

interface BookRequest extends ExpressRequest {
  files?: MulterFile[] | { [fieldname: string]: MulterFile[] };
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
      {
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        filename_override: file.originalname,
      },
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

export const create = async (req: BookRequest, res: Response) => {
  const user: any = req.user;
  try {
    let coverImageUrl = null;
    let pdfUrl = null;
    let audioUrl = null;
    let videoUrl = null;

    if (req.files && !Array.isArray(req.files)) {
      coverImageUrl = req.files.coverImage?.[0]
        ? await uploadToCloudinary(req.files.coverImage[0], "image")
        : null;

      pdfUrl = req.files.pdf?.[0]
        ? await uploadToCloudinary(req.files.pdf[0], "raw")
        : null;

      audioUrl = req.files.audio?.[0]
        ? await uploadToCloudinary(req.files.audio[0], "video")
        : null;

      videoUrl = req.files.video?.[0]
        ? await uploadToCloudinary(req.files.video[0], "video")
        : null;
    }

    const bookData = {
      ...req.body,
      type: req.body.type?.split(",").map((t: string) => t.trim()),
      creatorId: user.id,
      coverImageUrl,
      pdfUrl,
      audioUrl,
      videoUrl,
    };
    const book = await createBook(bookData);
    res.status(201).json({
      message: "New book uploaded successful",
      book,
    });
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
    res.status(200).json({
      message: "Books",
      books,
    });
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
    return res.status(200).json({
      message: "book",
      book,
    });
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
      return;
    }

    let coverImageUrl = existingBook.coverImageUrl;
    let pdfUrl = existingBook.pdfUrl;
    let audioUrl = existingBook.audioUrl;
    let videoUrl = existingBook.videoUrl;

    if (req.files && !Array.isArray(req.files)) {
      coverImageUrl = req.files.coverImage?.[0]
        ? await uploadToCloudinary(req.files.coverImage[0], "image")
        : existingBook.coverImageUrl;

      pdfUrl = req.files.pdf?.[0]
        ? await uploadToCloudinary(req.files.pdf[0], "raw")
        : existingBook.pdfUrl;

      audioUrl = req.files.audio?.[0]
        ? await uploadToCloudinary(req.files.audio[0], "video")
        : existingBook.audioUrl;

      videoUrl = req.files.video?.[0]
        ? await uploadToCloudinary(req.files.video[0], "video")
        : existingBook.videoUrl;
    }

    const updatedBookData = {
      ...req.body,
      type: req.body.type?.split(",").map((t: string) => t.trim()),
      coverImageUrl,
      pdfUrl,
      audioUrl,
      videoUrl,
    };

    const updatedBook = await updateBook(req.params.id, updatedBookData);

    res.status(200).json({
      message: "Book details updated successfully",
      book: updatedBook,
    });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};

export const remove = async (req: ExpressRequest, res: Response) => {
  try {
    const existingBook = await getBookById(req.params.id);
    if (!existingBook) {
      res.status(404).json({ message: "Book not found" });
    } else {
      await deleteBook(req.params.id);
      res.status(204).send({ message: "Book deleted successful" });
    }
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
    res.status(200).json({
      message: "search funds",
      books,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
};
