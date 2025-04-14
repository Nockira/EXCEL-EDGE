import React from "react";
import { Link } from "react-router-dom";
import AboutImg from "../../assets/bussnessTeam.jpg";
import { TeamMember } from "../common/OurTeam";
import { useTranslation } from "react-i18next";

// Dummy team data
const teamMembers = [
  {
    id: 1,
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Jane Smith",
    role: "CEO & Founder",
    contacts: "+250781234567",
  },
  {
    id: 2,
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    role: "CTO",
    contacts: "johandoe@gmail.com",
  },
  {
    id: 3,
    imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sarah Johnson",
    role: "Marketing Director",
    contacts: "sarhJson@gmail.com",
  },
  {
    id: 4,
    imageUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Michael Brown",
    role: "Lead Developer",
    contacts: "+2533094686",
  },
];

export const AboutSection = () => {
  const { t } = useTranslation<string>();
  return (
    <>
      {" "}
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={AboutImg}
            alt="pricing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
              {t("about.aboutUs")}
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4  mb-8">
              {t("about.aboutUsDescription")}
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* TIN Management */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-yellow-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-[#fdc901]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#fdc901] mb-3">
              {t("about.tinManagement")}
            </h3>
            <p className="text-gray-600 mb-4">{t("about.tinDescription")}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.monthlyMaintenance")}</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.pricingTiers")}</span>
              </li>
            </ul>
          </div>

          {/* Digital Services */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-yellow-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-[#fdc901]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#fdc901] mb-3">
              {t("about.digitalSolutions")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("about.digitalDescription")}
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.googleSetup")}</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.libraryAccess")}</span>
              </li>
            </ul>
          </div>

          {/* Our Approach */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-yellow-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-[#fdc901]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#fdc901] mb-3">
              {t("about.ourApproach")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("about.approachDescription")}
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.transparentPricing")}</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.paymentOptions")}</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-4 w-4 text-[#fdc901] mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("about.subscriptionProcess")}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-center mb-12">
            {t("about.ourTeam")}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMember
                key={member.id}
                imageUrl={member.imageUrl}
                name={member.name}
                role={member.role}
                contacts={member.contacts}
              />
            ))}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#fdc901] mb-4">
            {t("about.ready")}
          </h3>
          <p className="text-gray-600 mb-6">{t("about.cta")}</p>
          <button className="bg-[#fdc901] hover:text-[#fdc901] text-white font-medium py-2 px-6 rounded-md transition-colors">
            <Link to="/pricing">{t("about.viewPricing")}</Link>
          </button>
        </div>
      </div>
    </>
  );
};
