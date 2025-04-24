import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import your background images
import BackImage from "../../assets/slide.png";
import BackImage2 from "../../assets/bgimage.jpg";
import BackImage3 from "../../assets/about.jpg";

const backgroundImages = [BackImage, BackImage2, BackImage3];

export const HeroSection = () => {
  const { t } = useTranslation<string>();
  const token = localStorage.getItem("accessToken") || "";

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[86vh] w-full text-white overflow-hidden">
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
      <div className="relative z-20 h-full flex flex-col items-start justify-center px-6 sm:px-28">
        <h1 className="sm:text-4xl text-2xl font-bold mb-4 leading-tight">
          {t("hero.headline")}{" "}
          <span className="text-yellow-400">{t("hero.highlight")}</span>
        </h1>
        <p className="sm:text-lg text-base max-w-[600px] mb-6">
          {t("hero.description")}
        </p>

        {!token ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/sign-in"
              className="bg-[#fdc901] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:text-black transition text-center"
            >
              {t("hero.join")}
            </Link>
            <Link
              to="/login"
              className="bg-[#fdc901] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:text-black transition text-center sm:hidden"
            >
              {t("hero.login")}
            </Link>
          </div>
        ) : (
          <Link
            to="/services"
            className="px-8 py-3 border border-white text-white rounded-md font-medium hover:bg-white hover:text-black transition"
          >
            {t("cta.viewServices")}
          </Link>
        )}
      </div>
    </div>
  );
};
