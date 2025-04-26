import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPhone } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { sendRequest } from "../../services/service";
import { countries, Country } from "../../data/countries";
import { toast } from "react-toastify";

export const ContactUs = () => {
  const { t } = useTranslation<string>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === "RW") || countries[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find((c) => c.code === e.target.value);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const fullPhoneNumber = `${selectedCountry.dialCode}${formData.phone}`;

      const submissionData = {
        ...formData,
        phone: fullPhoneNumber,
      };

      await sendRequest(submissionData);

      toast.success(t("toast.contactFormSubmit"));
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error(t("toast.submitErrorMessage"));
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 bg-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-600 text-center">
        {t("contact.title")}
      </h2>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-8 p-4">
        {/* Contact Info Section */}
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
          {submitStatus && (
            <div
              className={`mb-4 p-4 rounded ${
                submitStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-800 text-sm font-bold mb-2"
                htmlFor="name"
              >
                {t("contact.form.name")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
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
                className="block text-gray-800 text-sm font-bold mb-2"
                htmlFor="email"
              >
                {t("contact.form.email")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
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
                className="block text-gray-800 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                {t("contact.form.phone")}
              </label>
              <div className="flex">
                <select
                  value={selectedCountry.code}
                  onChange={handleCountryChange}
                  className="shadow appearance-none border rounded-l w-1/3 py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  className="shadow appearance-none border rounded-r w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="788123456"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-800 text-sm font-bold mb-2"
                htmlFor="message"
              >
                {t("contact.form.send")}
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline h-32"
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
                className={`bg-[#fdc901] hover:bg-[#e6b800] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("contact.form.sending")}
                  </span>
                ) : (
                  t("contact.form.send")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
