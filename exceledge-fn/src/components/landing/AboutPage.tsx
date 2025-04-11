import React from "react";
import { Link } from "react-router-dom";
import AboutImg from "../../assets/bussnessTeam.jpg";

export const AboutSection = () => {
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
              About Us
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4  mb-8">
              We provide comprehensive financial and digital solutions tailored
              for Rwandan businesses, helping you navigate tax compliance,
              establish online presence, and access valuable resources.
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
              TIN Management
            </h3>
            <p className="text-gray-600 mb-4">
              Our tiered pricing structure accommodates businesses of all sizes,
              from startups to enterprises, ensuring proper tax compliance at
              every growth stage.
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
                <span>Monthly maintenance based on turnover</span>
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
                <span>Five pricing tiers from 10,000 to 500,000 RWF/month</span>
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
              Digital Solutions
            </h3>
            <p className="text-gray-600 mb-4">
              Establish and grow your online presence with our one-time setup
              services and ongoing digital resources.
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
                <span>Google Business Profile setup (39,999 RWF)</span>
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
                <span>Digital Library access (3,600 RWF/month)</span>
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
              Our Approach
            </h3>
            <p className="text-gray-600 mb-4">
              We combine local expertise with modern solutions to deliver
              services that actually work in the Rwandan context.
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
                <span>Transparent, tiered pricing</span>
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
                <span>Multiple secure payment options</span>
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
                <span>Simple subscription process</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#fdc901] mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Choose from our transparent pricing options and subscribe in
            minutes. We're here to support your business growth every step of
            the way.
          </p>
          <button className="bg-[#fdc901] hover:text-[#fdc901] text-white font-medium py-2 px-6 rounded-md transition-colors">
            <Link to="/pricing">View Pricing Options</Link>
          </button>
        </div>
      </div>
    </>
  );
};
