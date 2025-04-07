import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/vdlogo.png";

export const MainHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About us" },
    { to: "/services", label: "Services" },
    { to: "/questions", label: "FAQ" },
    { to: "/pricing", label: "Pricing" },
    { to: "/announcements", label: "Announcements" },
  ];

  const authLinks = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  const dashboardLink = { to: "/dashboard", label: "Dashboard" };
  const logoutLabel = "Logout";

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add your logout logic here (e.g., clear tokens, redirect, etc.)
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-white text-black shadow-lg"
          : "bg-transparent shadow-md text-white"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <img src={logo} alt="Exceledge" width="50" height="50" />
          <span className="text-green-800">Exceledge</span>
        </Link>
        <div className="flex items-center text-lg">
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:underline ${
                  location.pathname === link.to
                    ? "text-green-800 font-bold"
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
          <div className="hidden md:flex space-x-6 ml-6">
            {isLoggedIn ? (
              <>
                <Link
                  to={dashboardLink.to}
                  className={`border py-1 px-2 border-green-600 bg-green-900 rounded-md  ${
                    location.pathname === dashboardLink.to
                      ? "text-white font-bold"
                      : "text-white"
                  }`}
                >
                  {dashboardLink.label}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:underline text-black"
                >
                  {logoutLabel}
                </button>
              </>
            ) : (
              authLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`border py-1 px-2 border-green-800 bg-green-800 rounded-md ${
                    location.pathname === link.to
                      ? "text-white font-bold"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
          <button
            className="md:hidden focus:outline-none ml-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute top-16 left-0 w-full bg-white shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col p-4 space-y-4 text-lg">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`hover:text-green-700 ${
                      location.pathname === link.to
                        ? "text-green-700 font-bold"
                        : "text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isLoggedIn ? (
                  <>
                    <Link
                      to={dashboardLink.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`border py-1 px-2 border-green-900 bg-green-900 rounded-md  ${
                        location.pathname === dashboardLink.to
                          ? "text-green-700 font-bold"
                          : "text-white"
                      }`}
                    >
                      {dashboardLink.label}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsSidebarOpen(false);
                      }}
                      className="border py-1 px-2 border-green-900 bg-green-900 rounded-md text-white text-left"
                    >
                      {logoutLabel}
                    </button>
                  </>
                ) : (
                  authLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`border py-1 px-2 border-green-900 bg-green-900 rounded-md  ${
                        location.pathname === link.to
                          ? "text-green-800 font-bold"
                          : "text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
