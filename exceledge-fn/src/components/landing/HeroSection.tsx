import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export const HeroSection = () => {
  const { t } = useTranslation<string>();

  return (
    <div className="h-[80vh] w-full items-center justify-center text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[90vh] object-cover absolute top-0 left-0"
        style={{ zIndex: 1 }}
      >
        <source src="/videos/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative text-start px-6 z-10 sm:pl-28 pl-4 sm:pr-28 pr-4 pt-0 flex flex-col items-start justify-center h-full bg-gradient-to-r from-black via-black/70 to-transparent">
        <h1 className="sm:text-3xl text-xl font-bold mb-4">
          {t("hero.headline")}{" "}
          <span className="text-yellow-400"> {t("hero.highlight")}</span>
        </h1>
        <p className="sm:text-lg sm:block hidden text-normal w-[90%] sm:w-[60%] mb-6">
          {t("hero.description")}
        </p>

        <Link
          to="/sign-in"
          className="sm:mt-6 mt-2 sm:inline-block hidden bg-[#fdc901] text-white px-6 sm:py-3 py-2 rounded-lg text-lg font-semibold hover:text-black transition"
        >
          {t("hero.join")}
        </Link>
        <Link
          to="/login"
          className="sm:mt-6 mt-2 sm:hidden inline-block bg-[#fdc901] text-center text-white px-6 sm:py-3 py-2 rounded-lg text-lg font-semibold hover:text-black w-full transition"
        >
          {t("hero.login")}
        </Link>
      </div>
    </div>
  );
};
