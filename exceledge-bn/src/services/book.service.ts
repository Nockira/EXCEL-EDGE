import { prisma } from "../utils/prisma.service";

import { CreateBookInput, UpdateBookInput } from "../../types";

export const createBook = async (data: CreateBookInput) => {
  return await prisma.book.create({ data });
};

export const getAllBooks = async () => {
  return await prisma.book.findMany({
    include: {
      createdBy: {
        select: {
          firstName: true,
          secondName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getBookById = async (id: string) => {
  return await prisma.book.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          firstName: true,
          secondName: true,
        },
      },
    },
  });
};

export const updateBook = async (id: string, data: UpdateBookInput) => {
  return await prisma.book.update({ where: { id }, data });
};

export const deleteBook = async (id: string) => {
  return await prisma.book.delete({ where: { id } });
};

type FilterInput = {
  title?: string;
  author?: string;
  language?: string;
  format?: string;
};

export const filterBooks = async ({ title, author, language }: FilterInput) => {
  const filters: Record<string, any> = {};

  if (title) {
    filters.title = { contains: title, mode: "insensitive" };
  }

  if (author) {
    filters.author = { contains: author, mode: "insensitive" };
  }

  if (language) {
    filters.language = { equals: language, mode: "insensitive" };
  }

  return await prisma.book.findMany({
    where: filters,
    include: {
      createdBy: {
        select: {
          firstName: true,
          secondName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
