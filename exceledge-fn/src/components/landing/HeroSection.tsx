import React from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="h-[70vh] w-full items-center justify-center text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[80vh] object-cover absolute top-0 left-0"
        style={{ zIndex: 1 }}
      >
        <source src="/videos/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative text-start px-6 z-10 sm:pl-28 pl-4 sm:pr-28 pr-4 pt-0 flex flex-col items-start justify-center h-full bg-gradient-to-r from-black via-black/70 to-transparent">
        <h1 className="sm:text-2xl text-lg font-bold mb-4">
          Innovate and Grow Your Business with Exceledge
        </h1>
        <p className="sm:text-lg text-normal w-[90%] sm:w-[60%] mb-6">
          At Exceledge, we provide seamless, efficient, and innovative financial
          and business services tailored to your needs. From instant payments to
          expert consulting, our platform empowers businesses of all sizes with
          powerful tools for growth and success.
          <p className="mt-4">
            Join Exceledge and transform the way you do business. Whether you're
            a startup or an established enterprise, we're here to help you
            succeed.
          </p>
        </p>

        <Link
          to="/register-shop"
          className="sm:mt-6 mt-2 inline-block bg-green-900 text-white px-6 sm:py-3 py-2 rounded-lg text-lg font-semibold hover:bg-green-800 transition"
        >
          Join us now
        </Link>
      </div>
    </div>
  );
};
