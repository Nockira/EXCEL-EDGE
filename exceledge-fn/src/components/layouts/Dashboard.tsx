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
} from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";

interface UserData {
  firstName: string;
  secondName: string;
  email: string;
  role: string;
}

export const AdminDashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded: any = jwtDecode(token);
        setUserData({
          firstName: decoded.firstName || "User",
          secondName: decoded.secondName || "Second",
          email: decoded.email || "",
          role: decoded.role || "",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("accessToken");
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
            {initials}
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
        lg:translate-x-0 transform fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#fdc901] text-white transition-transform duration-300 ease-in-out`}
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
            <h2 className="text-xs uppercase tracking-wider text-black mb-4">
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
            <h2 className="text-xs uppercase tracking-wider text-black mb-4">
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
            <h2 className="text-xs uppercase tracking-wider text-black mb-4">
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
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FiBell className="text-gray-600" />
              </button>
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
