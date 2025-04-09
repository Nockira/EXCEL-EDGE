import React, { useState } from "react";
import { MainLayout } from "../components/layouts/MainLayout";

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export const PricingPage = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert all services to flat structure with TIN management ranges as separate services
  const allServices: Service[] = [
    // TIN Management options
    {
      id: "tin-0-10m",
      name: "TIN Management (0-10M RWF)",
      description: "Monthly TIN management for small businesses",
      price: "10,000 RWF/month",
      category: "Small business",
    },
    {
      id: "tin-10-20m",
      name: "TIN Management (10-20M RWF)",
      description: "Monthly TIN management for growing businesses",
      price: "20,000 RWF/month",
      category: "Growing business",
    },
    {
      id: "tin-20-50m",
      name: "TIN Management (20-50M RWF)",
      description: "Monthly TIN management for medium businesses",
      price: "100,000 RWF/month",
      category: "Medium business",
    },
    {
      id: "tin-50-100m",
      name: "TIN Management (50-100M RWF)",
      description: "Monthly TIN management for large businesses",
      price: "300,000 RWF/month",
      category: "Large business",
    },
    {
      id: "tin-100m-plus",
      name: "TIN Management (100M+ RWF)",
      description: "Monthly TIN management for enterprise businesses",
      price: "500,000 RWF/month",
      category: "Enterprise businesses",
    },
    // Other services
    {
      id: "google-location",
      name: "Google Location Setup",
      description: "One-time service to establish your business on Google Maps",
      price: "39,999 RWF",
      category: "Digital Services",
    },
    {
      id: "digital-library",
      name: "Digital Library Access",
      description: "Monthly subscription to our resource library",
      price: "3,600 RWF/month",
      category: "Books",
    },
  ];

  const handleProceedToPayment = (service: Service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      setShowPaymentModal(false);
    }, 2000);
  };

  const resetPayment = () => {
    setSelectedService(null);
    setPaymentMethod("");
    setPaymentCompleted(false);
  };

  if (paymentCompleted && selectedService) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-yellow-200">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#fdc901]"
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
          </div>
          <h2 className="text-2xl font-bold text-[#fdc901] mb-2">
            Payment Successful!
          </h2>
          <div className="text-left bg-yellow-50 p-4 rounded-md my-6">
            <p className="font-medium">
              Service:{" "}
              <span className="text-[#fdc901]">{selectedService.name}</span>
            </p>
            <p className="font-medium">
              Amount:{" "}
              <span className="text-[#fdc901]">{selectedService.price}</span>
            </p>
            <p className="font-medium">
              Method: <span className="text-[#fdc901]">{paymentMethod}</span>
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. We've sent a confirmation to your email.
          </p>
          <button
            onClick={resetPayment}
            className="bg-[#fdc901] hover:text-[#fdc901] text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-600">
          Our Services & Pricing
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#fdc901] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Service</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-[#fdc901]">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {service.category}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {service.description}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#fdc901]">
                    {service.price}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleProceedToPayment(service)}
                      className="bg-[#fdc901] hover:text-[#fdc901] text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      Subscribe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-[#fdc901] mb-4">
                Complete Payment
              </h3>

              <div className="mb-6">
                <h4 className="font-medium text-gray-500 mb-2">Service:</h4>
                <p className="text-[#fdc901] font-medium">
                  {selectedService.name}
                </p>
                <p className="text-gray-600 text-sm">
                  {selectedService.description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-500 mb-2">Amount:</h4>
                <p className="text-[#fdc901] font-bold text-xl">
                  {selectedService.price}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-500 mb-3">
                  Select payment method:
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile-money"
                      checked={paymentMethod === "mobile-money"}
                      onChange={() => setPaymentMethod("mobile-money")}
                      className="h-5 w-5 text-[#fdc901]"
                    />
                    <span>Mobile Money (MTN/Airtel)</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={!paymentMethod || isProcessing}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    !paymentMethod || isProcessing
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#fdc901] hover:text-[#fdc901] text-white"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                      Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
