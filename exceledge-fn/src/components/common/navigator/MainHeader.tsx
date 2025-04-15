import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react";
import logo from "../../../assets/exceledge1.png";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../../../services/service";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { SubHeader } from "./SubHeader";

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

  const { t } = useTranslation<string>();

  const links = [
    { to: "/", label: t("navigation.home") },
    { to: "/about", label: t("navigation.about") },
    { to: "/services", label: t("navigation.services") },
    { to: "/questions", label: t("navigation.faq") },
    { to: "/pricing", label: t("navigation.pricing") },
    { to: "/pages/announcements", label: t("navigation.announcements") },
  ];

  const authLinks = [
    { to: "/login", label: t("navigation.login") },
    { to: "/sign-in", label: t("navigation.register") },
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
        <SubHeader />
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
              {isSidebarOpen ? "" : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-2xl font-bold"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <img src={logo} alt="Exceledge" width="100" height="100" />
                </Link>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`block py-3 px-4 rounded-md hover:bg-gray-100 text-lg ${
                      location.pathname === link.to
                        ? "text-[#fdc901] font-bold bg-gray-50"
                        : "text-gray-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Auth section */}
              <div className="p-4 border-t">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                      {isFetching ? (
                        <BeatLoader size={8} color="white" />
                      ) : userData ? (
                        `${userData.firstName.charAt(
                          0
                        )}${userData.secondName.charAt(0)}`.toUpperCase()
                      ) : (
                        "US"
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {userData?.firstName} {userData?.secondName}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    {authLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`py-2 px-4 rounded-md text-center ${
                          link.to === "/login"
                            ? "border border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                            : "bg-[#fdc901] text-white hover:bg-yellow-600"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
