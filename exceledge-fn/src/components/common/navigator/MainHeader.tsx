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
import { Modal } from "../../models/Model";

interface UserData {
  firstName: string;
  secondName: string;
  email: string;
  role: string;
}

export const MainHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topHeaderVisible, setTopHeaderVisible] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErpModal, setShowErpModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation<string>();
  const token = localStorage.getItem("accessToken");
  const links = [
    { to: "/", label: t("navigation.home") },
    { to: "/about", label: t("navigation.about") },
    { to: "/services", label: t("navigation.services") },
    { to: "/questions", label: t("navigation.faq") },
    { to: "/books", label: t("navigation.book") },
    { to: "/pages/announcements", label: t("navigation.announcements") },
  ];

  // const authLinks = [
  //   { to: "/login", label: t("navigation.login") },
  //   { to: "/sign-in", label: t("navigation.register") },
  // ];

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
  }, [token]); // ← rerun if token changes

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("accessToken");
    navigate("/", { replace: true });
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
            className={`sm:block hidden text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""
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

  const bannerHeight = showBanner ? "40px" : "0px";
  const subHeaderHeight = "32px"; // Approximate height of subheader content container, adjust if needed but container has padding
  // Calculating effective top position:
  // If topHeaderVisible:
  //   - Banner is visible: top = bannerHeight + subheaderHeight (approx)
  //   - Banner closed: top = subheaderHeight
  // Actually, let's look at the structure.
  // The SubHeader container is fixed top-0. To stack them:
  // 1. Banner (fixed top-0)
  // 2. SubHeader (fixed top-bannerHeight)
  // 3. MainNavbar (fixed top-bannerHeight+subHeaderHeight)

  // However, the original code had SubHeader fixed top-0.
  // We will wrap Banner and SubHeader in a container or adjust their tops.

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 flex flex-col ${topHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {showBanner && (
          <div className="bg-red-600 text-white text-sm py-2 px-4 flex justify-between items-center h-[40px]">
            <div className="container mx-auto flex justify-center items-center gap-4">
              <span>Access our ERP Portal for advanced features like inventory management and more.</span>
              <a
                href="https://erp.exceledgecpa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-600 px-3 py-0.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors"
                onClick={() => setShowBanner(false)}
              >
                Go to Portal
              </a>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="bg-black text-yellow-300 text-sm py-0 w-full">
          <SubHeader />
        </div>
      </div>

      <div
        className={`bg-[#fdc900] fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#fdc900] text-black shadow-lg"
          : "bg-[#fdc900] shadow-md text-black"
          }`}
        style={{
          top: topHeaderVisible
            ? showBanner
              ? "calc(8rem + 40px)" // 8rem (approx original) + banner
              : "8rem"
            : "0",
        }}
      >
        <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-8">
          <div className="flex items-center text-lg">
            {/* Desktop Links */}
            <div className="hidden md:flex font-medium space-x-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`hover:text-white ${location.pathname === link.to ? "text-white font-bold" : ""
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setShowErpModal(true)}
                className="hover:text-white font-medium"
              >
                ERP Portal
              </button>
            </div>
          </div>
          <div className="flex items-center text-lg">
            {/* Authentication Links */}
            <div className="hidden md:flex items-center space-x-6 ml-6">
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <a
                  href="/contact-us"
                  className="inline-block px-6 py-1 border border-black text-black rounded-md hover:bg-yellow-600 transition"
                >
                  {t("navigation.connect")}
                </a>
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
                    className={`block py-3 px-4 rounded-md hover:bg-gray-100 text-lg ${location.pathname === link.to
                      ? "text-[#fdc901] font-bold bg-gray-50"
                      : "text-gray-800"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setShowErpModal(true);
                  }}
                  className="block w-full text-left py-3 px-4 rounded-md hover:bg-gray-100 text-lg text-gray-800"
                >
                  ERP Portal
                </button>
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
                    {/* {authLinks.map((link) => (
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
                    ))} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ERP Portal Modal */}
      <Modal isOpen={showErpModal} onClose={() => setShowErpModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">ERP Portal</h2>
          <p className="text-gray-600 mb-6">
            You are about to navigate to the ERP Portal. This will open in a new
            tab.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowErpModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <a
              href="https://erp.exceledgecpa.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowErpModal(false)}
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium"
            >
              Go to Portal
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};
