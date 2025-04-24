import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Service } from "../../types";
import { useServicesData } from "../data/services.data";
import { initiatePayment } from "../services/service";
import { API_URL } from "../services/service";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MainLayout } from "../components/layouts/MainLayout";
import TinMn from "../assets/TinMn.jpg";
import { AuthModal } from "../components/Auth/LoginRequired";

type PaymentStatus = "pending" | "processing" | "success" | "failed" | null;
const api_url: any = API_URL;
const socket = io(api_url);

export const PricingPage = () => {
  const allServices = useServicesData();
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation<string>();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleProceedToPayment = (service: Service) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsModalOpen(true);
      setSelectedService(service);
      return;
    }
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
      toast.error("Please select a payment method");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);
    setShowPaymentModal(false);
    setShowPaymentProcessing(true);
    setPaymentStatus("processing");

    try {
      const paymentData = {
        amount: calculateTotalPrice(),
        number: phoneNumber,
        duration: months,
        service: selectedService?.slug,
      };
      await initiatePayment(paymentData);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPayment = () => {
    setSelectedService(null);
    setSelectedProvider(null);
    setPaymentStatus(null);
    setShowPaymentProcessing(false);
    setPhoneNumber("");
    setMonths(1);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to backend socket server for notifications");
    });

    socket.on("payment-status-update", (data: any) => {
      if (data.status === "COMPLETED") {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
            {t("pricing.paymentSuccess")}
          </h2>
          <div className="text-left bg-green-50 p-4 rounded-md my-6">
            <p className="font-medium">
              {t("payment.service")}{" "}
              <span className="text-green-600">{selectedService.name}</span>
            </p>
            <p className="font-medium">
              {t("payment.amount")}{" "}
              <span className="text-green-600">
                {formatPrice(calculateTotalPrice())}
              </span>
            </p>
            {selectedService.isMonthly && (
              <p className="font-medium">
                {t("payment.subscription_period")}{" "}
                <span className="text-green-600">
                  {months}{" "}
                  {months > 1
                    ? `${t("payment.months")}`
                    : `${t("payment.month")}`}
                </span>
              </p>
            )}
            <p className="font-medium">
              {t("payment.method")}{" "}
              <span className="text-green-600">
                {selectedProvider === "mtn"
                  ? "MTN Mobile Money"
                  : "Airtel Money"}
              </span>
            </p>
          </div>
          <p className="text-gray-600 mb-6">{t("payment.thank_you")}</p>
          <button
            onClick={resetPayment}
            className="bg-[#fdc901] hover:bg-[#e6b800] text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            {t("payment.back")}
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
            {t("paymentFailed.title")}
          </h2>
          <div className="text-left bg-red-50 p-4 rounded-md my-6">
            <p className="font-medium">
              {t("paymentFailed.service")}:{" "}
              <span className="text-red-600">{selectedService?.name}</span>
            </p>
            <p className="font-medium">
              {t("paymentFailed.amount")}:{" "}
              <span className="text-red-600">
                {selectedService && formatPrice(calculateTotalPrice())}
              </span>
            </p>
          </div>
          <p className="text-gray-600 mb-6">{t("paymentFailed.thankYou")}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={resetPayment}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
            >
              {t("paymentFailed.back")}
            </button>
            <button
              onClick={() => {
                setPaymentStatus(null);
                setShowPaymentProcessing(false);
                setShowPaymentModal(true);
              }}
              className="bg-[#fdc901] hover:bg-[#e6b800] text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
              {t("paymentFailed.tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={TinMn}
            alt="pricing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
              {t("fqa.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4 mb-8">
              {t("fqa.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-36 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allServices.slice(0, 5).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              handleProceedToPayment={handleProceedToPayment}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#fdc901] mb-4">
              {t("paymentsCompletion.completePayment")}
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-gray-500 mb-2">
                {t("paymentsCompletion.service")}
              </h4>
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
                    {t("paymentsCompletion.duration")}
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
                <h4 className="font-medium text-gray-500 mb-2">
                  {" "}
                  {t("paymentsCompletion.amount")}
                </h4>
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
                {t("paymentsCompletion.selectPaymentMethod")}
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
                  {t("paymentsCompletion.paymentRequest")}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
              >
                {t("paymentsCompletion.cancel")}
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
                {isProcessing
                  ? `${t("paymentsCompletion.processing")}`
                  : `${t("paymentsCompletion.confirmPayment")}`}
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
                className="animate-spin h-8 w-8 text-yellow-500"
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
              {t("processPayment.processingPayment")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("processPayment.paymentRequest")}{" "}
              <strong>{selectedService?.name}</strong>
              <br />
              {t("processPayment.amount")}:{" "}
              <strong>
                {selectedService && formatPrice(calculateTotalPrice())}
              </strong>
            </p>
            <div className="bg-yellow-50 p-4 rounded-md text-left">
              <p className="font-medium text-gray-700">
                {t("processPayment.checkPhone")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedProvider === "mtn" ? (
                  <>{t("processPayment.paymentInstruction")}</>
                ) : (
                  <>{t("processPayment.paymentInstructionAirtel")}</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => {
          setIsModalOpen(false);
          if (selectedService) {
            setShowPaymentModal(true);
          }
        }}
      />
    </MainLayout>
  );
};

const ServiceCard = ({
  service,
  handleProceedToPayment,
  t,
}: {
  service: Service;
  handleProceedToPayment: (service: Service) => void;
  t: any;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className=" items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">{service.name}</h3>
        </div>

        <p className="text-gray-600 mb-5">{service.description}</p>

        <div className="flex items-center justify-center mb-6">
          <span className="text-normal font-medium text-black">
            {service.price}
          </span>
        </div>

        <button
          onClick={() => handleProceedToPayment(service)}
          className="w-full bg-[#e6b800] hover:bg-[#e6b800] text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {service.isMonthly
            ? `${t("servicesPricing.subscribe")}`
            : `${t("servicesPricing.purchase")}`}
        </button>
      </div>
    </div>
  );
};
