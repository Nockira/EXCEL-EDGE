import React, { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MainLayout } from "../components/layouts/MainLayout";
import AnnouncementImg from "../assets/Announcement.jpeg";
import { fetchAnnouncement } from "../services/service";

type Announcement = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    firstName: string;
    secondName: string;
  };
};

export const Announcements = () => {
  const [expandedAnnouncement, setExpandedAnnouncement] =
    useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    const getAnnouncements = async () => {
      setLoading(true);
      try {
        const announcementsList = await fetchAnnouncement();
        setAnnouncements(announcementsList.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setErr(new Error(error.message));
        } else {
          setErr(new Error("An unknown error occurred"));
        }
      }
    };
    getAnnouncements();
  }, []);
  // Calculate pagination
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);

  const handleAnnouncementClick = (announcement: Announcement) => {
    setExpandedAnnouncement(announcement);
  };

  const handleCloseExpanded = () => {
    setExpandedAnnouncement(null);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <MainLayout>
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={AnnouncementImg}
            alt="pricing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
              Announcements
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4 mb-4">
              Bookmark our page to ensure you never miss an announcement or
              limited-time offer.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 sm:pl-20 sm:pr-20">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <p className="text-sm text-gray-500 mt-2">
            Showing {indexOfFirstAnnouncement + 1}-
            {Math.min(indexOfLastAnnouncement, announcements.length)} of{" "}
            {announcements.length} announcements
          </p>
        </div>

        {/* Announcements List */}
        <div className="min-h-[200px] flex items-center justify-center">
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
          ) : (
            <div className="divide-y divide-gray-200 w-full">
              {currentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {announcement.title}
                      </h3>
                      <div
                        className="text-gray-600 mb-4 quill-content"
                        dangerouslySetInnerHTML={{
                          __html: announcement.content,
                        }}
                      />
                    </div>
                    <FiChevronDown className="text-gray-400 flex-shrink-0 ml-4 mt-1" />
                  </div>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {announcement.author.firstName}{" "}
                      {announcement.author.secondName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {announcements.length > announcementsPerPage && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#fdc901] hover:bg-yellow-50"
              }`}
            >
              <FiChevronLeft className="mr-2" />
              Previous
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      currentPage === number
                        ? "bg-yellow-100 text-[#fdc901] font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#fdc901] hover:bg-yellow-50"
              }`}
            >
              Next
              <FiChevronRight className="ml-2" />
            </button>
          </div>
        )}

        {/* Expanded Announcement View */}
        {expandedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#fdc901]">
                      {expandedAnnouncement.title}
                    </h2>
                    <div className="flex items-center mt-3 text-gray-500">
                      <span>
                        {new Date(
                          expandedAnnouncement.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>

                      <span className="mx-2">•</span>
                      <span>
                        {expandedAnnouncement.author.firstName}{" "}
                        {expandedAnnouncement.author.secondName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseExpanded}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div
                  className="text-gray-600 quill-content prose max-w-none mt-6 space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: expandedAnnouncement.content,
                  }}
                />
                <div className="mt-8">
                  <button
                    onClick={handleCloseExpanded}
                    className="bg-[#fdc901] hover:text-[#fdc901] text-white py-2.5 px-6 rounded-md font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
