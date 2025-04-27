import React, { useState, useEffect } from "react";
import { createBookSchema } from "../../../schemas/bookSchema";
import { BeatLoader } from "react-spinners";
import {
  FiBook,
  FiUpload,
  FiSearch,
  FiX,
  FiFile,
  FiMusic,
  FiVideo,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiTrash2,
  FiImage,
} from "react-icons/fi";
import * as yup from "yup";
import { getAllBooks, uploadBook, updateBook } from "../../../services/service";
import { toast } from "react-toastify";

interface Book {
  id: number;
  title: string;
  author: string;
  type: string[];
  createdAt: string;
  language: string;
  downloads: number;
  coverImageFile?: File;
  pdfFile?: File;
  audioFile?: File;
  videoFile?: File;
}

export const Resources = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getAllBooks();
        setBooks(allBooks);
      } catch (error) {
        if (error instanceof Error) {
          setErr(new Error(error.message));
        } else {
          setErr(new Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [newBook, setNewBook] = useState<
    Omit<Book, "id" | "createdAt" | "downloads"> & {
      coverImageFile?: File;
      pdfFile?: File;
      audioFile?: File;
      videoFile?: File;
    }
  >({
    title: "",
    author: "",
    type: ["PDF"],
    language: "English",
  });

  const bookTypes = ["PDF", "Video", "Audio"];

  const booksPerPage = 10;
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();
    return (
      (book.title?.toLowerCase() || "").includes(search) ||
      (book.author?.toLowerCase() || "").includes(search) ||
      book.type.some((type) => type.toLowerCase().includes(search)) ||
      (book.language?.toLowerCase() || "").includes(search)
    );
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFileChange =
    (field: "coverImageFile" | "pdfFile" | "audioFile" | "videoFile") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setNewBook({ ...newBook, [field]: e.target.files[0] });
        setErrors({ ...errors, [field]: "" });
      }
    };

  const handleTypeChange = (type: string) => {
    setNewBook((prev) => {
      if (prev.type.includes(type)) {
        return {
          ...prev,
          type: prev.type.filter((t) => t !== type),
          ...(type === "pdf" && { pdfFile: undefined }),
          ...(type === "audio" && { audioFile: undefined }),
          ...(type === "video" && { videoFile: undefined }),
        };
      } else {
        return {
          ...prev,
          type: [...prev.type, type],
        };
      }
    });
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      const modifiedSchema = createBookSchema.shape({
        coverImageUrl: yup.mixed().notRequired(),
        pdfUrl: yup.mixed().notRequired(),
        audioUrl: yup.mixed().notRequired(),
        videoUrl: yup.mixed().notRequired(),
      });

      await modifiedSchema.validate(newBook, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const validationErrors: Record<string, string> = {};

        error.inner.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });

        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!(await validateForm())) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Always send these fields for new books
      const isNew = !isEditMode || !currentBook;

      if (isNew || newBook.title !== currentBook.title) {
        formData.append("title", newBook.title);
      }

      if (isNew || newBook.author !== currentBook.author) {
        formData.append("author", newBook.author);
      }

      if (isNew || newBook.language !== currentBook.language) {
        formData.append("language", newBook.language);
      }

      if (
        isNew ||
        newBook.type.sort().join(",") !== currentBook.type.sort().join(",")
      ) {
        formData.append("type", newBook.type.join(","));
      }

      if (newBook.coverImageFile) {
        formData.append("coverImage", newBook.coverImageFile);
      }

      if (newBook.type.includes("PDF") && newBook.pdfFile) {
        formData.append("pdf", newBook.pdfFile);
      }

      if (newBook.type.includes("Audio") && newBook.audioFile) {
        formData.append("audio", newBook.audioFile);
      }

      if (newBook.type.includes("Video") && newBook.videoFile) {
        formData.append("video", newBook.videoFile);
      }

      if (isEditMode && currentBook) {
        await updateBook(currentBook.id.toString(), formData);
        const allBooks = await getAllBooks();
        setBooks(allBooks);
        toast.success("Book updated successfully");
      } else {
        await uploadBook(formData);
        const allBooks = await getAllBooks();
        setBooks(allBooks);
        toast.success("New book created successfully");
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error saving book: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while saving the book.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setIsEditMode(true);
    setNewBook({
      title: book.title,
      author: book.author,
      type: book.type,
      language: book.language,
      coverImageFile: book.coverImageFile,
      pdfFile: book.pdfFile,
      audioFile: book.audioFile,
      videoFile: book.videoFile,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (bookToDelete === null) return;

    setDeleteLoading(true);
    try {
      // await deleteBook(bookToDelete.toString());
      setBooks(books.filter((book) => book.id !== bookToDelete));
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error("Failed to delete book");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const resetForm = () => {
    setNewBook({
      title: "",
      author: "",
      type: ["PDF"],
      language: "English",
    });
    setErrors({});
    setIsEditMode(false);
    setCurrentBook(null);
  };

  const getFileIcons = (type: string[]) => {
    return type.map((type) => {
      switch (type) {
        case "Video":
          return <FiVideo key={type} className="inline mr-1" />;
        case "Audio":
          return <FiMusic key={type} className="inline mr-1" />;
        default:
          return <FiFile key={type} className="inline mr-1" />;
      }
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FiBook className="mr-2" /> Books
        </h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center sm:text-normal text-sm"
        >
          <FiUpload className="mr-2" /> Add New Book
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="animate-spin h-8 w-8 text-yellow-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : currentBooks.length > 0 ? (
                currentBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {book.type.map((type) => (
                          <span
                            key={type}
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {getFileIcons([type])} {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </td>
                    <td className="flex px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiEdit className="mr-1" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(book.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <FiTrash2 className="mr-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBooks.length > booksPerPage && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstBook + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastBook, filteredBooks.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredBooks.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? "z-10 bg-yellow-50 border-yellow-500 text-yellow-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {isEditMode ? "Edit Book" : "Add New Book"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              {/* First row - Title and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title*
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.title
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-400"
                    }`}
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                    placeholder="Enter book title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Author*
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.author
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-400"
                    }`}
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                    placeholder="Enter author name"
                  />
                  {errors.author && (
                    <p className="text-red-500 text-xs mt-1">{errors.author}</p>
                  )}
                </div>
              </div>

              {/* Second row - Type and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Book Types*
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bookTypes.map((type) => (
                      <label key={type} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-yellow-500 rounded focus:ring-yellow-400"
                          checked={newBook.type.includes(type)}
                          onChange={() => handleTypeChange(type)}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Language*
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.language
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-yellow-400"
                    }`}
                    value={newBook.language}
                    onChange={(e) =>
                      setNewBook({ ...newBook, language: e.target.value })
                    }
                  >
                    <option value="English">English</option>
                    <option value="Kinyarwanda">Kinyarwanda</option>
                    <option value="French">French</option>
                  </select>
                  {errors.language && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.language}
                    </p>
                  )}
                </div>
              </div>

              {/* Third row - Cover Image Upload */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cover Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-20 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-2">
                      {newBook.coverImageFile ? (
                        <>
                          <FiImage className="w-6 h-6 text-gray-400" />
                          <p className="pt-1 text-xs text-gray-500 truncate w-full px-2">
                            {newBook.coverImageFile.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-6 h-6 text-gray-400" />
                          <p className="pt-1 text-xs text-gray-500">
                            Click to browse cover image
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="opacity-0"
                      onChange={handleFileChange("coverImageFile")}
                      accept="image/*"
                    />
                  </label>
                </div>
                {errors.coverImageFile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.coverImageFile}
                  </p>
                )}
              </div>

              {/* File uploads for each selected type */}
              {newBook.type.includes("PDF") && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {`*PDF File( < 10MB)`}{" "}
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-20 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300">
                      <div className="flex flex-col items-center justify-center pt-2">
                        {newBook.pdfFile ? (
                          <>
                            <FiFile className="w-6 h-6 text-gray-400" />
                            <p className="pt-1 text-xs text-gray-500 truncate w-full px-2">
                              {newBook.pdfFile.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <FiUpload className="w-6 h-6 text-gray-400" />
                            <p className="pt-1 text-xs text-gray-500">
                              Click to browse PDF file
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="opacity-0"
                        onChange={handleFileChange("pdfFile")}
                        accept=".pdf,.doc,.docx,.txt,.odt"
                      />
                    </label>
                  </div>
                  {errors.pdfFile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pdfFile}
                    </p>
                  )}
                </div>
              )}

              {newBook.type.includes("Video") && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Video File*
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-20 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300">
                      <div className="flex flex-col items-center justify-center pt-2">
                        {newBook.videoFile ? (
                          <>
                            <FiVideo className="w-6 h-6 text-gray-400" />
                            <p className="pt-1 text-xs text-gray-500 truncate w-full px-2">
                              {newBook.videoFile.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <FiUpload className="w-6 h-6 text-gray-400" />
                            <p className="pt-1 text-xs text-gray-500">
                              Click to browse video file
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="opacity-0"
                        onChange={handleFileChange("videoFile")}
                        accept="video/*"
                      />
                    </label>
                  </div>
                  {errors.videoFile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.videoFile}
                    </p>
                  )}
                </div>
              )}

              {newBook.type.includes("Audio") && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Audio File*
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-20 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300">
                      <div className="flex flex-col items-center justify-center pt-2">
                        {newBook.audioFile ? (
                          <>
                            <FiMusic className="w-6 h-6 text-gray-400" />
                            <p className="pt-1 text-xs text-gray-500 truncate w-full px-2">
                              {newBook.audioFile.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <FiUpload className="w-6 h-6 text-gray-400" />
                            <p className="pt-1 text-xs text-gray-500">
                              Click to browse audio file
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="opacity-0"
                        onChange={handleFileChange("audioFile")}
                        accept="audio/*"
                      />
                    </label>
                  </div>
                  {errors.audioFile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.audioFile}
                    </p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  disabled={
                    !newBook.title || !newBook.author || !newBook.language
                  }
                  className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
                    !newBook.title || !newBook.author || !newBook.language
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isEditMode ? (
                    isLoading ? (
                      <BeatLoader />
                    ) : (
                      "Update Book"
                    )
                  ) : isLoading ? (
                    <BeatLoader />
                  ) : (
                    "Add Book"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <BeatLoader size={8} color="white" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
