import React, { useState } from "react";
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
} from "react-icons/fi";

interface Resource {
  id: number;
  name: string;
  type: string;
  date: string;
  language: string;
  downloads: number;
}

export const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      name: "User Guide",
      type: "PDF",
      date: "2023-06-15",
      language: "English",
      downloads: 1245,
    },
    {
      id: 2,
      name: "Tutorial Video",
      type: "Video",
      date: "2023-06-10",
      language: "Kinyarwanda",
      downloads: 892,
    },
    {
      id: 3,
      name: "Training Audio",
      type: "Audio",
      date: "2023-06-05",
      language: "French",
      downloads: 567,
    },
    // Add more dummy data as needed
    ...Array.from({ length: 25 }, (_, i) => ({
      id: i + 4,
      name: `Resource ${i + 4}`,
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
  const [newResource, setNewResource] = useState({
    name: "",
    type: "PDF",
    language: "English",
    file: null as File | null,
  });
  const resourcesPerPage = 10;

  // Filter resources based on search term
  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(
    indexOfFirstResource,
    indexOfLastResource
  );
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, file: e.target.files[0] });
    }
  };

  const handleUpload = () => {
    if (newResource.name && newResource.file) {
      const newResourceItem: Resource = {
        id: resources.length + 1,
        name: newResource.name,
        type: newResource.type,
        date: new Date().toISOString().split("T")[0],
        language: newResource.language,
        downloads: 0,
      };
      setResources([newResourceItem, ...resources]);
      setIsModalOpen(false);
      setNewResource({
        name: "",
        type: "PDF",
        language: "English",
        file: null,
      });
    }
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
          <FiBook className="mr-2" /> Resources
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiUpload className="mr-2" /> Upload New
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
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
                  Name
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
              {currentResources.length > 0 ? (
                currentResources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {resource.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getFileIcon(resource.type)} {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(resource.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-yellow-600 hover:text-yellow-900 mr-3 flex items-center">
                        <FiDownload className="mr-1" /> Download (
                        {resource.downloads})
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No resources found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredResources.length > resourcesPerPage && (
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
                  <span className="font-medium">
                    {indexOfFirstResource + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastResource, filteredResources.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredResources.length}
                  </span>{" "}
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Upload New Resource</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={newResource.name}
                  onChange={(e) =>
                    setNewResource({ ...newResource, name: e.target.value })
                  }
                  placeholder="Enter resource name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Resource Type
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
                >
                  <option value="PDF">Document (PDF)</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Language
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={newResource.language}
                  onChange={(e) =>
                    setNewResource({ ...newResource, language: e.target.value })
                  }
                >
                  <option value="English">English</option>
                  <option value="Kinyarwanda">Kinyarwanda</option>
                  <option value="French">French</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <FiUpload className="w-8 h-8 text-gray-400" />
                      <p className="pt-1 text-sm text-gray-500">
                        {newResource.file
                          ? newResource.file.name
                          : "Drag and drop your file here or click to browse"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="opacity-0"
                      onChange={handleFileChange}
                      accept={
                        newResource.type === "PDF"
                          ? ".pdf"
                          : newResource.type === "Video"
                          ? "video/*"
                          : "audio/*"
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!newResource.name || !newResource.file}
                  className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
                    !newResource.name || !newResource.file
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
