import React, { useState } from "react";
import { MainLayout } from "../components/layouts/MainLayout";
import Pricing from "../assets/price-value.webp";

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  basePrice: number;
  category: string;
  isMonthly: boolean;
};

type PaymentStatus = "pending" | "processing" | "success" | "failed" | null;

export const PricingPage = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [months, setMonths] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<
    "mtn" | "airtel" | null
  >(null);

  const allServices: Service[] = [
    {
      id: "tin-0-10m",
      name: "TIN Management (0-10M RWF)",
      description: "Monthly TIN management for small businesses",
      price: "10,000 RWF/month",
      basePrice: 10000,
      category: "Small business",
      isMonthly: true,
    },
    {
      id: "tin-10-20m",
      name: "TIN Management (10-20M RWF)",
      description: "Monthly TIN management for growing businesses",
      price: "20,000 RWF/month",
      basePrice: 20000,
      category: "Growing business",
      isMonthly: true,
    },
    {
      id: "tin-20-50m",
      name: "TIN Management (20-50M RWF)",
      description: "Monthly TIN management for medium businesses",
      price: "100,000 RWF/month",
      basePrice: 100000,
      category: "Medium business",
      isMonthly: true,
    },
    {
      id: "tin-50-100m",
      name: "TIN Management (50-100M RWF)",
      description: "Monthly TIN management for large businesses",
      price: "300,000 RWF/month",
      basePrice: 300000,
      category: "Large business",
      isMonthly: true,
    },
    {
      id: "tin-100m-plus",
      name: "TIN Management (100M+ RWF)",
      description: "Monthly TIN management for enterprise businesses",
      price: "500,000 RWF/month",
      basePrice: 500000,
      category: "Enterprise businesses",
      isMonthly: true,
    },
    {
      id: "google-location",
      name: "Google Location Setup",
      description: "One-time service to establish your business on Google Maps",
      price: "39,999 RWF",
      basePrice: 39999,
      category: "Digital Services",
      isMonthly: false,
    },
    {
      id: "digital-library",
      name: "Digital Library Access",
      description: "Monthly subscription to our resource library",
      price: "3,600 RWF/month",
      basePrice: 3600,
      category: "Books",
      isMonthly: true,
    },
  ];

  const handleProceedToPayment = (service: Service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
    setMonths(1);
    setSelectedProvider(null);
    setPhoneNumber("");
  };

  const calculateTotalPrice = () => {
    if (!selectedService) return 0;
    return selectedService.basePrice * months;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedProvider) {
      alert("Please select a payment method");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);
    setShowPaymentModal(false);
    setShowPaymentProcessing(true);
    setPaymentStatus("processing");

    try {
      const response = await initiatePaymentApiCall({
        serviceId: selectedService?.id,
        amount: calculateTotalPrice(),
        phoneNumber,
        provider: selectedProvider,
        months,
      });

      if (response.success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePaymentApiCall = async (paymentData: any) => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2;
        resolve({ success: isSuccess });
      }, 2000);
    });
  };

  const resetPayment = () => {
    setSelectedService(null);
    setSelectedProvider(null);
    setPaymentStatus(null);
    setShowPaymentProcessing(false);
    setPhoneNumber("");
    setMonths(1);
  };

  if (paymentStatus === "success" && selectedService) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-green-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
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
          <h2 className="text-2xl font-bold text-green-500 mb-2">
            Payment Successful!
          </h2>
          <div className="text-left bg-green-50 p-4 rounded-md my-6">
            <p className="font-medium">
              Service:{" "}
              <span className="text-green-600">{selectedService.name}</span>
            </p>
            <p className="font-medium">
              Amount:{" "}
              <span className="text-green-600">
                {formatPrice(calculateTotalPrice())}
              </span>
            </p>
            {selectedService.isMonthly && (
              <p className="font-medium">
                Duration:{" "}
                <span className="text-green-600">
                  {months} {months > 1 ? "months" : "month"}
                </span>
              </p>
            )}
            <p className="font-medium">
              Method:{" "}
              <span className="text-green-600">
                {selectedProvider === "mtn"
                  ? "MTN Mobile Money"
                  : "Airtel Money"}
              </span>
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. You will receive a confirmation message
            to your phone shortly.
          </p>
          <button
            onClick={resetPayment}
            className="bg-[#fdc901] hover:bg-[#e6b800] text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Payment Failed
          </h2>
          <div className="text-left bg-red-50 p-4 rounded-md my-6">
            <p className="font-medium">
              Service:{" "}
              <span className="text-red-600">{selectedService?.name}</span>
            </p>
            <p className="font-medium">
              Amount:{" "}
              <span className="text-red-600">
                {selectedService && formatPrice(calculateTotalPrice())}
              </span>
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Please check your mobile money
            account balance and try again. If the problem persists, contact our
            support.
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={resetPayment}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
            >
              Back to Services
            </button>
            <button
              onClick={() => {
                setPaymentStatus(null);
                setShowPaymentProcessing(false);
                setShowPaymentModal(true);
              }}
              className="bg-[#fdc901] hover:bg-[#e6b800] text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="relative">
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={Pricing}
            alt="pricing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
              Our Services & Pricing
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4 mb-8">
              Transparent pricing for exceptional value - discover the perfect
              plan for your needs
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-12 px-4">
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
                      className="bg-[#fdc901] hover:bg-[#e6b800] text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      {service.isMonthly ? "Subscribe" : "Purchase"}
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

              <div className="flex items-center justify-between mb-6">
                {selectedService.isMonthly && (
                  <div className="w-1/2 pr-2">
                    <h4 className="font-medium text-gray-500 mb-2">
                      Duration:
                    </h4>
                    <select
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={1}>1 Month</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months</option>
                    </select>
                  </div>
                )}
                <div
                  className={`${
                    selectedService.isMonthly ? "w-1/2 pl-2" : "w-full"
                  }`}
                >
                  <h4 className="font-medium text-gray-500 mb-2">Amount:</h4>
                  <p className="text-[#fdc901] font-bold text-xl">
                    {formatPrice(calculateTotalPrice())}
                    {selectedService.isMonthly && (
                      <span className="text-sm font-normal text-gray-600 ml-1">
                        ({months} {months > 1 ? "months" : "month"})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-500 mb-3">
                  Select payment method:
                </h4>
                <div className="flex space-x-4">
                  <label className="flex-1 flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mtn"
                      checked={selectedProvider === "mtn"}
                      onChange={() => setSelectedProvider("mtn")}
                      className="h-5 w-5 text-[#fdc901]"
                    />
                    <span>MTN Mobile Money</span>
                  </label>
                  <label className="flex-1 flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="airtel"
                      checked={selectedProvider === "airtel"}
                      onChange={() => setSelectedProvider("airtel")}
                      className="h-5 w-5 text-[#fdc901]"
                    />
                    <span>Airtel Money</span>
                  </label>
                </div>
              </div>

              {selectedProvider && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-500 mb-2">
                    Enter your {selectedProvider === "mtn" ? "MTN" : "Airtel"}{" "}
                    phone number:
                  </h4>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={`e.g. ${
                      selectedProvider === "mtn" ? "0781234567" : "0731234567"
                    }`}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll receive a payment request on this number
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={!selectedProvider || !phoneNumber || isProcessing}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    !selectedProvider || !phoneNumber || isProcessing
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#fdc901] hover:bg-[#e6b800] text-white"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Processing Modal */}
        {showPaymentProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
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
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600 mb-4">
                You have requested payment for{" "}
                <strong>{selectedService?.name}</strong>
                <br />
                Amount:{" "}
                <strong>
                  {selectedService && formatPrice(calculateTotalPrice())}
                </strong>
              </p>
              <div className="bg-yellow-50 p-4 rounded-md text-left">
                <p className="font-medium text-gray-700">
                  Check your phone for a payment request notification
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProvider === "mtn" ? (
                    <>
                      Or dial <strong>*182*7*1#</strong> to complete your
                      payment
                    </>
                  ) : (
                    <>Or follow Airtel Money prompts to complete your payment</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
