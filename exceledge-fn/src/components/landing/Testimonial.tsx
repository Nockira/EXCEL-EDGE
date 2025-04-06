import React from "react";
import GetStartedImage from "../../assets/get-started.png"; // Assuming you have an image in this path

export const Testimonial = () => {
  return (
    <div>
      {/* Testimonial Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "Their TIN management service has saved us countless hours and
                helped us avoid penalties. Highly recommended for any business
                in Rwanda."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Jean Mutesi</h4>
                  <p className="text-gray-600">Small Business Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "Getting our business established on Google Maps increased our
                visibility tremendously. The team made the process simple and
                straightforward."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Mugisha</h4>
                  <p className="text-gray-600">Restaurant Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "Their accounting and tax services have been invaluable for our
                growing company. Their expertise has helped us navigate complex
                tax regulations with ease."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Claire Uwimana</h4>
                  <p className="text-gray-600">Tech Startup CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="sm:px-24 sm:pb-12 p-4 bg-green-50">
        <div className="  sm:flex block bg-green-700 text-white py-16 rounded-[20px]">
          <div className="px-24 sm:w-1/2 w-full sm:flex hidden justify-center items-center">
            <img src={GetStartedImage} alt="getStarted" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contact us today to discuss how we can help your business succeed
              in Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-green-600 rounded-md font-medium">
                Schedule Consultation
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-md font-medium">
                View All Services
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
