import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiBell,
  FiBook,
  FiMenu,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User, Check } from "lucide-react";
import {
  fetchUserProfile,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  requireAdmin,
} from "../../services/service";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface UserData {
  firstName: string;
  secondName: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const AdminDashboard = () => {
  requireAdmin();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
      setIsFetching(true);

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;

        if (!userId) {
          throw new Error("User ID not found in token");
        }
        const response = await fetchUserProfile(userId);
        setUserData({
          firstName: response.data.firstName,
          secondName: response.data.secondName,
          email: response.data.email,
          role: response.data.role,
        });
        setError(null);
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile");
        try {
          const decoded: any = jwtDecode(token);
          setUserData({
            firstName: decoded.firstName || "User",
            secondName: decoded.secondName || "",
            email: decoded.email || "",
            role: decoded.role || "",
          });
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
        }
      } finally {
        setIsFetching(false);
      }
    };

    loadUserProfile();
  }, [token]);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setIsLoadingNotifications(true);
      const response = await getNotifications();
      if (response.status !== 200) {
        throw new Error("Failed to fetch notifications");
      }
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("accessToken");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: false })));
      toast.error("Failed to mark all notifications as read");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const initials = userData
      ? `${userData.firstName.charAt(0)}${userData.secondName.charAt(
          0
        )}`.toUpperCase()
      : "US";

    return (
      <div className="relative ml-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
            {isFetching ? <BeatLoader size={12} color="yellow" /> : initials}
          </div>
          <div className="sm:flex hidden">
            {userData?.firstName} {userData?.secondName}
          </div>
          <ChevronDown
            size={16}
            className={`sm:block hidden text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">
                {userData?.firstName} {userData?.secondName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email}
              </p>
            </div>
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="mr-2" />
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
                navigate("/");
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  const NotificationsDropdown = () => {
    return (
      <div className="relative">
        <button
          onClick={() =>
            setShowNotificationsDropdown(!showNotificationsDropdown)
          }
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative"
        >
          <FiBell className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotificationsDropdown && (
          <div className="absolute right-0 -left-52 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
            <div className="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto w-full sm:w-auto">
              {isLoadingNotifications ? (
                <div className="p-4 flex justify-center">
                  <BeatLoader size={8} color="#fdc901" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`border-b border-gray-100 last:border-b-0 ${
                        !notification.isRead ? "bg-blue-100" : ""
                      }`}
                    >
                      <div className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="ml-2 text-blue-600 hover:text-blue-700"
                                title="Mark as read"
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 mt-1">
                            <span className="font-medium">
                              {notification.message}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            Visit your email for details about the message
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="ml-2 text-gray-400 hover:text-red-500"
                          title="Delete notification"
                        >
                          <FiTrash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#fdc901] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } 
        lg:translate-x-0 transform fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black text-white transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-yellow-600 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-yellow-500 mb-4">
              Main Sections
            </h2>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/admin-dashboard/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded ${
                      isActive ? "bg-gray-500" : "hover:bg-gray-500"
                    }`
                  }
                >
                  <FiHome className="text-lg" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-dashboard/users"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded ${
                      isActive ? "bg-gray-500" : "hover:bg-gray-500"
                    }`
                  }
                >
                  <FiUsers className="text-lg" />
                  <span>User Management</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-dashboard/payments"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded ${
                      isActive ? "bg-gray-500" : "hover:bg-gray-500"
                    }`
                  }
                >
                  <FiDollarSign className="text-lg" />
                  <span>Payments</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xs text-yellow-500 uppercase tracking-wider text-black mb-4">
              Content Management
            </h2>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/admin-dashboard/announcements"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded ${
                      isActive ? "bg-gray-500" : "hover:bg-gray-500"
                    }`
                  }
                >
                  <FiBell className="text-lg" />
                  <span>Announcements</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-dashboard/resources"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded ${
                      isActive ? "bg-gray-500" : "hover:bg-gray-500"
                    }`
                  }
                >
                  <FiBook className="text-lg" />
                  <span>Resources</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase text-yellow-500 tracking-wider text-black mb-4">
              System
            </h2>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-500 text-red-500"
                >
                  <FiHome className="text-lg text-red-500" />
                  <span>Back Home</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationsDropdown />
              <div className="flex items-center space-x-2">
                <UserDropdown />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
