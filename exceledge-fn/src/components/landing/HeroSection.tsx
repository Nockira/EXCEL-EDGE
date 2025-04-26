import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import your background images
import BackImage from "../../assets/slide.png";
import BackImage2 from "../../assets/bgimage.jpg";
import BackImage3 from "../../assets/about.jpg";

const backgroundImages = [BackImage, BackImage2, BackImage3];
const api_url =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
export const HeroSection = () => {
  const { t } = useTranslation<string>();
  const [googleLoading, setGoogleLoading] = useState(false);
  const token = localStorage.getItem("accessToken") || "";

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = `${api_url}/users/google-auth`;
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

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />

      {/* Content */}
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
            to="/services"
            className="sm:w-[40%] w-full flex items-center justify-center items-center gap-3 bg-white/20 backdrop-blur-md border border-gray-500 text-white font-medium py-2.5 px-4 rounded-full disabled:opacity-50 mb-4 transition-all"
          >
            {t("cta.viewServices")}
          </Link>
        )}
      </div>
    </div>
  );
};
