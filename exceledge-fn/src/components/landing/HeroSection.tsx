import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal } from "../models/Model";

// Import your background images
import BackImage from "../../assets/slide.png";
import BackImage2 from "../../assets/bgimage.jpg";
import BackImage3 from "../../assets/man-holding-contract-his-new-office-job-after-interview.jpg";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../../services/service";
import { BeatLoader } from "react-spinners";

const backgroundImages = [BackImage, BackImage2, BackImage3];
const api_url =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

interface UserData {
  id?: string;
  phone?: string;
}

export const HeroSection = () => {
  const { t } = useTranslation<string>();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken") || "";
  const decoded: { id?: string } = token ? jwtDecode(token) : {};
  // Fetch user data when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      setLoadingUser(true);
      try {
        if (!decoded.id) {
          console.error("User ID is undefined");
          return;
        }
        const response = await fetchUserProfile(decoded.id);

        if (response.data) {
          const data = await response.data;
          setUserData(data);
          // Check if phone is missing
          if (!data.phone) {
            setShowPhoneModal(true);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    // Check URL params first (for Google auth redirect)
    const params = new URLSearchParams(window.location.search);
    const registered = params.get("registered");

    if (registered === "true") {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserData();
    } else if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = `${api_url}/users/google-auth`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setPhoneError(
        t("user_register.phone_required") || "Phone number is required."
      );
      return;
    }

    // Basic phone validation (adjust as needed)
    if (phoneNumber.trim().length < 8) {
      setPhoneError(
        t("user_register.phone_invalid") || "Invalid phone number."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${api_url}/users/${userData?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      setLoading(false);

      if (response.ok) {
        setUserData((prev) => ({ ...prev, phone: phoneNumber }));
        setShowPhoneModal(false);
        navigate("/");
      } else {
        const errorData = await response.json();
        setPhoneError(
          errorData.message ||
            t("common.error_occurred") ||
            "An error occurred."
        );
      }
    } catch (error) {
      setPhoneError(t("common.network_error") || "Network error occurred.");
    }
  };

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[85.6vh] w-full text-white overflow-hidden">
      {/* Background Images with Fade Animation */}
      {backgroundImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Background ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? "opacity-100 z-0" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />
      <div className="relative z-20 h-full flex flex-col justify-center sm:pt-16 px-6 sm:px-28">
        <h1 className="sm:text-4xl text-2xl font-bold mb-4 leading-tight">
          {t("hero.headline")}{" "}
          <span className="text-yellow-400">{t("hero.highlight")}</span>
        </h1>
        <p className="sm:text-lg sm:block hidden text-base mb-24 max-w-[600px]">
          {t("hero.description")}
        </p>

        {!token ? (
          <div className="flex justify-center flex-col sm:flex-row gap-4">
            <button
              disabled={googleLoading}
              className="sm:w-[40%] w-full flex items-center justify-center items-center gap-3 bg-white/20 backdrop-blur-md border border-gray-500 text-white font-medium py-2.5 px-4 rounded-full disabled:opacity-50 mb-4 transition-all"
              onClick={handleGoogleAuth}
            >
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              <span>
                {googleLoading
                  ? t("paymentsCompletion.processing")
                  : t("user_register.sign_up_with_google")}
              </span>
            </button>
          </div>
        ) : (
          <Link
            to={userData?.phone ? "/services" : "#"}
            onClick={
              !userData?.phone ? () => setShowPhoneModal(true) : undefined
            }
            className="sm:w-[40%] w-full flex items-center justify-center items-center gap-3 bg-white/20 backdrop-blur-md border border-gray-500 text-white font-medium py-2.5 px-4 rounded-full disabled:opacity-50 mb-4 transition-all"
          >
            {loadingUser ? t("common.loading") : t("cta.viewServices")}
          </Link>
        )}
      </div>

      {/* Phone Number Modal */}
      <Modal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(true)}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-gray-800">
          <h2 className="text-xl font-bold mb-4">
            {t("user_register.add_phone_title")}
          </h2>
          <p className="mb-4">{t("user_register.add_phone_description")}</p>

          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                {t("user_register.phone_number")}
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneError("");
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder={t("user_register.phone_placeholder") || ""}
                autoFocus
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {loading ? <BeatLoader /> : t("common.submit")}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
