import React, { useState, useMemo } from "react";
import { FiBell, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { dashboardData } from "./dashboardData";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const AnnouncementsDashboard = () => {
  const [announcements, setAnnouncements] = useState(
    dashboardData.announcements
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{
    id: number;
    title: string;
    content: string;
    date: string;
    status: string;
    priority: string;
  } | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    status: "Active",
  });

  // Initialize form when editing or creating new
  const initializeForm = (announcement: any) => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        priority: announcement.priority,
        status: announcement.status,
      });
      setEditorContent(announcement.content);
    } else {
      setFormData({
        title: "",
        priority: "Medium",
        status: "Active",
      });
      setEditorContent("");
    }
  };

  const handleDelete = (id: any) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
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

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const newAnnouncement = {
      id: currentAnnouncement ? currentAnnouncement.id : Date.now(),
      title: formData.title,
      content: editorContent,
      date: currentAnnouncement
        ? currentAnnouncement.date
        : new Date().toISOString().split("T")[0],
      status: formData.status,
      priority: formData.priority,
    };

    if (currentAnnouncement) {
      // Update existing announcement
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === currentAnnouncement.id ? newAnnouncement : ann
        )
      );
    } else {
      // Add new announcement
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setIsModalOpen(false);
  };

  // Quill editor modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
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
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          >
            <div
              className={`p-3 border-b ${
                announcement.priority === "High"
                  ? "bg-red-50 border-red-200"
                  : announcement.priority === "Medium"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{announcement.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    announcement.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : announcement.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {announcement.priority}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div
                className="text-gray-600 mb-4 quill-content"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(announcement.date).toLocaleDateString()}</span>
                <span
                  className={`px-2 py-1 rounded ${
                    announcement.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {announcement.status}
                </span>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(announcement)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDelete(announcement.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

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
                  <div className="border rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
                    <ReactQuill
                      theme="snow"
                      value={editorContent}
                      onChange={setEditorContent}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your announcement content here..."
                      className="h-64 mb-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                    </select>
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
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    {currentAnnouncement ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add some basic styles for the rendered content */}
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
