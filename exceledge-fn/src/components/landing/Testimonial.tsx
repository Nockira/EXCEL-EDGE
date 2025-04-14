import React from "react";
import GetStartedImage from "../../assets/get-started.png"; // Assuming you have an image in this path
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Testimonial = () => {
  const { t } = useTranslation<string>();
  return (
    <div>
      {/* Testimonial Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("testimonials.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                {t("testimonials.jean.quote")}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Jean Mutesi</h4>
                  <p className="text-gray-600">{t("testimonials.jean.role")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                {t("testimonials.robert.quote")}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Mugisha</h4>
                  <p className="text-gray-600">
                    {t("testimonials.robert.role")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                {t("testimonials.claire.quote")}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Claire Uwimana</h4>
                  <p className="text-gray-600">
                    {t("testimonials.claire.role")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="sm:px-24 sm:pb-12 p-4">
        <div className="  sm:flex block bg-black text-white py-16 rounded-[20px]">
          <div className="px-24 sm:w-1/2 w-full sm:flex hidden justify-center items-center">
            <img src={GetStartedImage} alt="getStarted" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">{t("cta.desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 border border-white text-white rounded-md font-medium">
                <Link to="/services">{t("cta.viewServices")}</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
