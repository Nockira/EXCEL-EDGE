import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPhone } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export const ContactUs = () => {
  const { t } = useTranslation<string>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    // Here you would typically send the data to your backend
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="py-8 bg-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-600 text-center">
        {t("contact.title")}
      </h2>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-8 p-4">
        {/* Map Section */}
        <div className="grid items-center w-full md:w-1/2">
          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start">
              <IoLocation className="h-5 w-5 text-[#fdc901] mt-1 mr-3" />
              <div>
                <p className="text-gray-600 font-medium">
                  {t("contact.address")}
                </p>
                <p className="text-gray-800">
                  42 St KK 718, Excelege
                  <br />
                  Kigali, Rwanda
                </p>
              </div>
            </div>
            {/* Phone Number */}
            <div className="flex items-start">
              <FaPhone className="h-5 w-5 text-[#fdc901] mt-1 mr-3" />
              <div>
                <p className="text-gray-600 font-medium">
                  {t("contact.phone")}
                </p>
                <a href="tel:+250788123456" className="hover:underline">
                  +250 788 123 456
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <MdEmail className="h-5 w-5 text-[#fdc901] mt-1 mr-3" />
              <div>
                <p className="text-gray-600 font-medium">
                  {t("contact.email")}
                </p>
                <a href="mailto:info@company.com" className="hover:underline">
                  info@exceledge.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="name"
              >
                {t("contact.form.name")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={`${t("contact.form.placeholderName")}`}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="email"
              >
                {t("contact.form.email")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                {t("contact.form.phone")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(+250) 756-7890"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="message"
              >
                {t("contact.form.message")}
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline h-32"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={`${t("contact.form.placeholderMessage")}`}
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                className="bg-[#fdc901] hover:text-[#fdc901] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {t("contact.form.send")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
