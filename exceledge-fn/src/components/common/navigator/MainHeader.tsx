import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Facebook,
  Twitter,
  Youtube,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../../assets/exceledge1.png";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../../../services/service";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface UserData {
  firstName: string;
  secondName: string;
  email: string;
  role: string;
}
export const token = localStorage.getItem("accessToken");
export const MainHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topHeaderVisible, setTopHeaderVisible] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About us" },
    { to: "/services", label: "Services" },
    { to: "/questions", label: "FAQ" },
    { to: "/pricing", label: "Pricing" },
    { to: "/pages/announcements", label: "Announcements" },
  ];

  const authLinks = [
    { to: "/login", label: "Login" },
    { to: "/sign-in", label: "Register" },
  ];
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("accessToken");
    navigate("/");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      setTopHeaderVisible(!scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
            {isFetching ? (
              <BeatLoader size={12} color="yellow-500" />
            ) : (
              initials
            )}
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
            {userData?.role === "ADMIN" && (
              <Link
                to="/admin-dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} className="mr-2" />
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
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
    <>
      <div
        className={`bg-black text-yellow-300 text-sm py-2 px-8 md:px-8 w-full fixed top-0 left-0 z-40 transition-all duration-300 ${
          topHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="sm:flex hidden flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="mr-1">📍</span>
              <span>Kigali, Rwanda</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">✉️</span>
              <span>info@exceledge.com</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">📞</span>
              <span>+250 788 123 456</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a href="#" className="hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-white">
                <Youtube size={18} />
              </a>
            </div>

            <div className="flex items-center space-x-2 border-l border-gray-600 pl-4 ml-2">
              <div className="relative">
                <select
                  className="appearance-none bg-black text-yellow-300 hover:text-white pl-2 pr-8 py-1 rounded focus:outline-none cursor-pointer"
                  defaultValue="eng"
                >
                  <option value="kiny" className="bg-black flex items-center">
                    <span className="mr-1">🇷🇼</span> Kiny
                  </option>
                  <option value="eng" className="bg-black flex items-center">
                    <span className="mr-1">🇬🇧</span> Eng
                  </option>
                  <option value="fr" className="bg-black flex items-center">
                    <span className="mr-1">🇫🇷</span> Fr
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-8 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white text-black shadow-lg"
            : "bg-white shadow-md text-black"
        }`}
        style={{ top: topHeaderVisible ? "42px" : "0" }}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <img
              src={logo}
              alt="Exceledge"
              width="100"
              height="100"
              className=" 
              "
            />
          </Link>
          <div className="flex items-center text-lg">
            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`hover:text-yellow-300 ${
                    location.pathname === link.to
                      ? "text-yellow-300 font-bold"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center text-lg">
            {/* Authentication Links */}
            <div className="hidden md:flex items-center space-x-6 ml-6">
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`border py-1 px-2 border-yellow-500 bg-[#fdc901] rounded-md ${
                      location.pathname === link.to
                        ? "text-black font-bold"
                        : "text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </div>
            <div className="sm:hidden">
              {isLoggedIn ? <UserDropdown /> : ""}
            </div>
            <button
              className="md:hidden focus:outline-none ml-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div
                className="absolute top-32 left-0 w-full bg-white shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex flex-col p-4 space-y-4 text-lg">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`hover:text-[#fdc901] ${
                        location.pathname === link.to
                          ? "text-[#fdc901] font-bold"
                          : "text-black"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
