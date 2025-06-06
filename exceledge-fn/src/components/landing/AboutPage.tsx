import React from "react";
import { Link } from "react-router-dom";
import AboutImg from "../../assets/bussnessTeam.jpg";
import { TeamMember } from "../common/OurTeam";
import { useTranslation } from "react-i18next";
import enockImg from "../../assets/enock.jpg";
import edithImg from "../../assets/edith.png";
import shemaImg from "../../assets/shema.png";
import bertinImg from "../../assets/bertin.png";
import IshAli from "../../assets/ishimwe.jpeg";
import Eli1234 from "../../assets/elie.jpeg";
import eml12345 from "../../assets/Emelyine.jpeg";

// Dummy team data
const teamMembers = [
  {
    id: 1,
    imageUrl: enockImg,
    name: "Enock IRADUKUNDA",
    role: "CPA(R), BSC, MBA",
    contacts: "+250 788 701 837",
  },
  {
    id: 2,
    imageUrl: edithImg,
    name: "Edith INGABIRE",
    role: "BSO Manager",
    contacts: "+250 787 789 350",
  },
  {
    id: 3,
    imageUrl: shemaImg,
    name: "Shema Darius",
    role: "Head of Accounting",
    contacts: "+250 783 032 954",
  },
  {
    id: 4,
    imageUrl: bertinImg,
    name: "Bertin NIYONKURU",
    role: "Software Developer",
    contacts: "+250 783 021 801",
  },
  {
    id: 5,
    imageUrl: eml12345,
    name: "Emelyne DUHIRWE",
    role: "BBA, CPA(R)| Accounts & Tax Associate",
    contacts: "",
  },
  {
    id: 6,
    imageUrl: Eli1234,
    name: "Mr. Elie TUYIZERE",
    role: "Deputy BSO in charge of Agriculture industry",
    contacts: "+250783870024",
  },
  {
    id: 7,
    imageUrl: IshAli,
    name: "Aline ISHIMWE",
    role: "Accounts & Tax Associate",
    contacts: "",
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
            <h1 className="text-3xl md:text-3xl font-bold text-white mb-2 text-center">
              {t("about.aboutUs")}
            </h1>
            <p className="text-xl sm:block hidden md:text-xl text-white text-center max-w-2xl px-4  mb-8">
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
            <h3 className="text-xl font-bold mb-3">
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
            <h3 className="text-xl font-bold  mb-3">
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
            <h3 className="text-xl font-bold mb-3">{t("about.ourApproach")}</h3>
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
          <h1 className="text-3xl font-bold text-center mb-12">
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
          <button className="bg-[#fdc901] hover:text-black text-white font-medium py-2 px-6 rounded-md transition-colors">
            <Link to="/services">{t("about.viewPricing")}</Link>
          </button>
        </div>
      </div>
    </>
  );
};
