import React, { useState } from "react";
import { createBookSchema } from "../../../schemas/bookSchema";
import {
  FiBook,
  FiDownload,
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

interface Book {
  id: number;
  title: string;
  author: string;
  type: string;
  date: string;
  language: string;
  downloads: number;
  coverImageFile?: File;
  pdfFile?: File;
  audioFile?: File;
  videoFile?: File;
}

export const Resources = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "User Guide",
      author: "Admin Team",
      type: "PDF",
      date: "2023-06-15",
      language: "English",
      downloads: 1245,
    },
    {
      id: 2,
      title: "Tutorial Video",
      author: "Video Team",
      type: "Video",
      date: "2023-06-10",
      language: "Kinyarwanda",
      downloads: 892,
    },
    {
      id: 3,
      title: "Training Audio",
      author: "Audio Team",
      type: "Audio",
      date: "2023-06-05",
      language: "French",
      downloads: 567,
    },
    ...Array.from({ length: 25 }, (_, i) => ({
      id: i + 4,
      title: `Book ${i + 4}`,
      author: `Author ${i + 4}`,
      type: ["PDF", "Video", "Audio"][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        .toISOString()
        .split("T")[0],
      language: ["English", "Kinyarwanda", "French"][
        Math.floor(Math.random() * 3)
      ],
      downloads: Math.floor(Math.random() * 1000),
    })),
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newBook, setNewBook] = useState<
    Omit<Book, "id" | "date" | "downloads"> & {
      coverImageFile?: File;
      pdfFile?: File;
      audioFile?: File;
      videoFile?: File;
    }
  >({
    title: "",
    author: "",
    type: "PDF",
    language: "English",
  });

  const booksPerPage = 10;

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
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
        // Clear any previous errors for this field
        setErrors({ ...errors, [field]: "" });
      }
    };

  const validateForm = async (): Promise<boolean> => {
    try {
      // Create a modified schema that doesn't require URLs
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

    if (isEditMode && currentBook) {
      // Update existing book
      const updatedBooks = books.map((book) =>
        book.id === currentBook.id
          ? {
              ...newBook,
              id: currentBook.id,
              date: currentBook.date,
              downloads: currentBook.downloads,
            }
          : book
      );
      setBooks(updatedBooks);
    } else {
      // Create new book
      const newBookItem: Book = {
        id: books.length + 1,
        title: newBook.title,
        author: newBook.author,
        type: newBook.type,
        date: new Date().toISOString().split("T")[0],
        language: newBook.language,
        downloads: 0,
        coverImageFile: newBook.coverImageFile,
        pdfFile: newBook.pdfFile,
        audioFile: newBook.audioFile,
        videoFile: newBook.videoFile,
      };
      setBooks([newBookItem, ...books]);
    }

    resetForm();
    setIsModalOpen(false);
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const handleDownload = (book: Book) => {
    // In a real app, this would trigger the actual download from the uploaded file
    console.log(`Downloading ${book.title}`);
    // Update download count
    setBooks(
      books.map((b) =>
        b.id === book.id ? { ...b, downloads: b.downloads + 1 } : b
      )
    );

    // Simulate download (in a real app, you would use the actual file)
    alert(`Downloading ${book.title} (${book.type})`);
  };

  const resetForm = () => {
    setNewBook({
      title: "",
      author: "",
      type: "PDF",
      language: "English",
    });
    setErrors({});
    setIsEditMode(false);
    setCurrentBook(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <FiVideo className="inline mr-1" />;
      case "Audio":
        return <FiMusic className="inline mr-1" />;
      default:
        return <FiFile className="inline mr-1" />;
    }
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
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
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
              {currentBooks.length > 0 ? (
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
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getFileIcon(book.type)} {book.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(book.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDownload(book)}
                        className="text-yellow-600 hover:text-yellow-900 flex items-center"
                      >
                        <FiDownload className="mr-1" /> ({book.downloads})
                      </button>
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiEdit className="mr-1" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
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
                    Book Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={newBook.type}
                    onChange={(e) =>
                      setNewBook({ ...newBook, type: e.target.value })
                    }
                  >
                    <option value="PDF">Document (PDF)</option>
                    <option value="Video">Video</option>
                    <option value="Audio">Audio</option>
                  </select>
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

              {/* Fourth row - Content File Upload */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {newBook.type === "PDF"
                    ? "PDF File"
                    : newBook.type === "Video"
                    ? "Video File"
                    : "Audio File"}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-20 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-2">
                      {newBook.type === "PDF" && newBook.pdfFile ? (
                        <>
                          <FiFile className="w-6 h-6 text-gray-400" />
                          <p className="pt-1 text-xs text-gray-500 truncate w-full px-2">
                            {newBook.pdfFile.name}
                          </p>
                        </>
                      ) : newBook.type === "Video" && newBook.videoFile ? (
                        <>
                          <FiVideo className="w-6 h-6 text-gray-400" />
                          <p className="pt-1 text-xs text-gray-500 truncate w-full px-2">
                            {newBook.videoFile.name}
                          </p>
                        </>
                      ) : newBook.type === "Audio" && newBook.audioFile ? (
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
                            Click to browse{" "}
                            {newBook.type === "PDF"
                              ? "PDF"
                              : newBook.type === "Video"
                              ? "video"
                              : "audio"}{" "}
                            file
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="opacity-0"
                      onChange={
                        newBook.type === "PDF"
                          ? handleFileChange("pdfFile")
                          : newBook.type === "Video"
                          ? handleFileChange("videoFile")
                          : handleFileChange("audioFile")
                      }
                      accept={
                        newBook.type === "PDF"
                          ? ".pdf"
                          : newBook.type === "Video"
                          ? "video/*"
                          : "audio/*"
                      }
                    />
                  </label>
                </div>
                {(errors.pdfFile || errors.videoFile || errors.audioFile) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pdfFile || errors.videoFile || errors.audioFile}
                  </p>
                )}
              </div>

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
                    !newBook.title ||
                    !newBook.author ||
                    !newBook.language ||
                    (newBook.type === "PDF" && !newBook.pdfFile) ||
                    (newBook.type === "Video" && !newBook.videoFile) ||
                    (newBook.type === "Audio" && !newBook.audioFile)
                  }
                  className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
                    !newBook.title ||
                    !newBook.author ||
                    !newBook.language ||
                    (newBook.type === "PDF" && !newBook.pdfFile) ||
                    (newBook.type === "Video" && !newBook.videoFile) ||
                    (newBook.type === "Audio" && !newBook.audioFile)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isEditMode ? "Update Book" : "Add Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
