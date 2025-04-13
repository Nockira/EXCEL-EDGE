import React, { useState, useMemo, useEffect } from "react";
import { FiBell, FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  fetchAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../services/service";
import { toast } from "react-toastify";

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    firstName: string;
    secondName: string;
  };
};
export const AnnouncementsDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<Error | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        const announcementsList = await fetchAnnouncement();
        setAnnouncements(announcementsList.data);
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

    getAnnouncements();
  }, []);
  const initializeForm = (announcement: any) => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
      });
      setEditorContent(announcement.content);
    } else {
      setFormData({
        title: "",
        content: "",
      });
      setEditorContent("");
    }
  };

  const handleDeleteClick = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;

    try {
      setLoading(true);
      await deleteAnnouncement(announcementToDelete.id);
      setAnnouncements(
        announcements.filter((ann) => ann.id !== announcementToDelete.id)
      );
      toast.success("Announcement deleted successfully");
    } catch (error) {
      toast.error("Failed to delete announcement");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handleEdit = (announcement: any) => {
    setCurrentAnnouncement(announcement);
    initializeForm(announcement);
    setIsModalOpen(true);
  };

  const handleNewAnnouncement = () => {
    setCurrentAnnouncement(null);
    initializeForm(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newAnnouncement: any = {
      title: formData.title,
      content: editorContent,
    };

    if (currentAnnouncement) {
      setPostLoading(true);
      const response = await updateAnnouncement(
        currentAnnouncement.id,
        newAnnouncement
      );
      setPostLoading(false);
      if (response.message === "Announcement updated successful") {
        const refreshed = await fetchAnnouncement();
        setAnnouncements(refreshed.data);
        setPostLoading(false);
        toast.success(response.message || "Announcement updated successful");
      } else {
        toast.error("Failed to update announcement, try again ");
        setPostLoading(false);
      }
    } else {
      setPostLoading(true);
      const response = await createAnnouncement(newAnnouncement);
      if (response.message === "Announcement published") {
        const refreshed = await fetchAnnouncement();
        setAnnouncements(refreshed.data);
        setPostLoading(false);
        toast.success(response.message || "Announcement published");
      } else {
        toast.error("Failed to publish announcement try again later.");
      }
    }
    setIsModalOpen(false);
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  // Quill editor formats configuration
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "size",
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="sm:flex block justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FiBell className="mr-2" /> Announcements
        </h2>
        <button
          onClick={handleNewAnnouncement}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> New Announcement
        </button>
      </div>
      {loading ? (
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
      ) : err ? (
        <div className="text-red-500 text-lg">
          Failed to load announcements: {err.message}
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
            >
              <div className="p-3 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <div className="px-4 py-2 bg-gray-50 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-yellow-600 hover:text-blue-800 p-1"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(announcement)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-gray-600 mb-4 quill-content">
                  {(() => {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = announcement.content;
                    const plainText =
                      tempDiv.textContent || tempDiv.innerText || "";
                    if (plainText.length <= 150) {
                      return (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: announcement.content,
                          }}
                        />
                      );
                    }
                    return (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              announcement.content.substring(0, 150) + "...",
                          }}
                        />
                        <button className="text-blue-500">
                          use pen icon to read more
                        </button>
                      </>
                    );
                  })()}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            No Announcements
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            Let people know what you do by creating new Announcements.
          </p>
        </div>
      )}
      {/* Modal with Rich Text Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentAnnouncement ? "Edit Announcement" : "New Announcement"}
              </h3>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Content
                  </label>
                  <div className="focus-within:ring-yellow-400">
                    <ReactQuill
                      theme="snow"
                      value={editorContent}
                      onChange={setEditorContent}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your announcement content here..."
                      className="h-64 sm:mb-16 mb-20"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                    disabled={postLoading}
                  >
                    {postLoading
                      ? "Loading..."
                      : currentAnnouncement
                      ? "Update"
                      : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to delete the announcement "
                <span className="font-bold">
                  {announcementToDelete?.title}"?
                </span>
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setAnnouncementToDelete(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Basic styles for the rendered content */}
      <style>{`
        .quill-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        .quill-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .quill-content h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
        }
        .quill-content ul,
        .quill-content ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .quill-content a {
          color: #3182ce;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
