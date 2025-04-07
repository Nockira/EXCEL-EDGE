import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MainLayout } from "../components/layouts/MainLayout";

type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  isImportant?: boolean;
};

export const Announcements = () => {
  const [expandedAnnouncement, setExpandedAnnouncement] =
    useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;

  // Sample announcements data
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      content:
        "We will be performing scheduled maintenance on our servers this Friday from 2:00 AM to 4:00 AM. During this time, the platform will be unavailable. We apologize for any inconvenience this may cause and appreciate your understanding.",
      date: "2023-06-15",
      author: "Admin Team",
      isImportant: true,
    },
    {
      id: 2,
      title: "New TIN Management Features",
      content:
        "We've added new features to our TIN Management service! You can now download your monthly reports directly from the dashboard and view historical tax filings. These updates are available to all subscription levels.",
      date: "2023-06-10",
      author: "Product Team",
    },
    {
      id: 3,
      title: "Updated Pricing for Digital Library",
      content:
        "Starting next month, we're introducing a new premium tier for our Digital Library service. Existing subscribers will maintain their current pricing for 6 months. Check your email for details about your account.",
      date: "2023-06-05",
      author: "Billing Department",
    },
    {
      id: 4,
      title: "Holiday Office Hours",
      content:
        "Our support team will have reduced hours during the national holiday week (July 1-7). Response times may be slower than usual. For urgent matters, please use the priority support option in your dashboard.",
      date: "2023-05-28",
      author: "Support Team",
    },
    {
      id: 5,
      title: "New Training Materials Available",
      content:
        "We've added 15 new training videos and 3 e-books to the Digital Library covering advanced tax strategies for growing businesses. These resources are available to all subscribers at no additional cost.",
      date: "2023-05-20",
      author: "Content Team",
    },
    {
      id: 6,
      title: "Additional Announcement 1",
      content: "This is an additional announcement to demonstrate pagination.",
      date: "2023-05-15",
      author: "Admin Team",
    },
    {
      id: 7,
      title: "Additional Announcement 2",
      content: "Another announcement to fill out the pagination example.",
      date: "2023-05-10",
      author: "Admin Team",
    },
    {
      id: 8,
      title: "Additional Announcement 3",
      content: "More content to show how pagination works with more items.",
      date: "2023-05-05",
      author: "Admin Team",
    },
  ];

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
      <div className="bg-white rounded-lg shadow-md border border-gray-200 sm:pl-20 sm:pr-20">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-700">Announcements</h2>
          <p className="text-sm text-gray-500 mt-2">
            Showing {indexOfFirstAnnouncement + 1}-
            {Math.min(indexOfLastAnnouncement, announcements.length)} of{" "}
            {announcements.length} announcements
          </p>
        </div>

        {/* Announcements List */}
        <div className="divide-y divide-gray-200">
          {currentAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                announcement.isImportant ? "bg-yellow-50" : ""
              }`}
              onClick={() => handleAnnouncementClick(announcement)}
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <h3 className="font-medium text-gray-800 text-lg">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-500 mt-2 line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
                <FiChevronDown className="text-gray-400 flex-shrink-0 ml-4 mt-1" />
              </div>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <span>{announcement.date}</span>
                <span className="mx-2">•</span>
                <span>{announcement.author}</span>
                {announcement.isImportant && (
                  <span className="ml-3 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Important
                  </span>
                )}
              </div>
            </div>
          ))}
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
                  : "text-green-600 hover:bg-green-50"
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
                        ? "bg-green-100 text-green-700 font-medium"
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
                  : "text-green-600 hover:bg-green-50"
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
                    <h2 className="text-2xl font-bold text-green-700">
                      {expandedAnnouncement.title}
                    </h2>
                    <div className="flex items-center mt-3 text-gray-500">
                      <span>{expandedAnnouncement.date}</span>
                      <span className="mx-2">•</span>
                      <span>{expandedAnnouncement.author}</span>
                      {expandedAnnouncement.isImportant && (
                        <span className="ml-3 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          Important
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCloseExpanded}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="prose max-w-none text-gray-700 mt-6 space-y-4">
                  {expandedAnnouncement.content
                    .split("\n")
                    .map((paragraph, i) => (
                      <p key={i} className="text-gray-600">
                        {paragraph}
                      </p>
                    ))}
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleCloseExpanded}
                    className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-6 rounded-md font-medium transition-colors"
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
