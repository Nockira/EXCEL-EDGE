import React, { useEffect, useState } from "react";
import {
  Check,
  ShieldCheck,
  Globe,
  BookOpen,
  Calculator,
  FileText,
  Users,
  Lightbulb,
} from "lucide-react";
import ServicesImg from "../../assets/services.jpg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { initiatePayment } from "../../services/service";
import { API_URL } from "../../services/service";
import io from "socket.io-client";
import { AuthModal } from "../Auth/LoginRequired";

type PaymentStatus = "pending" | "processing" | "success" | "failed" | null;
const api_url: any = API_URL;
const socket = io("https://exceledgecpa.com/api");

export const ServiceSections = () => {
  const { t } = useTranslation<string>();
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [months, setMonths] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState<
    "mtn" | "airtel" | null
  >(null);

  const fixedServices = [
    {
      id: "tin-management",
      name: t("services.fixed.tin.name"),
      description: t("services.fixed.tin.description"),
      icon: <ShieldCheck className="h-6 w-6 text-[#fdc901]" />,
      subscribe: t("servicesPricing.subscribe"),
      isPayment: false,
    },
    {
      id: "google-location",
      name: t("services.fixed.google.name"),
      slug: "GOOGLE_LOCATION",
      description: t("services.fixed.google.description"),
      icon: <Globe className="h-6 w-6 text-[#fdc901]" />,
      price: 39999,
      basePrice: 39999,
      isMonthly: false,
      subscribe: t("servicesPricing.subscribe"),
      isPayment: true,
    },
    {
      id: "digital-library",
      name: t("services.fixed.library.name"),
      slug: "BOOKS",
      description: t("services.fixed.library.description"),
      icon: <BookOpen className="h-6 w-6 text-[#fdc901]" />,
      price: 3600,
      basePrice: 3600,
      isMonthly: true,
      subscribe: t("servicesPricing.subscribe"),
      isPayment: true,
    },
  ];

  const negotiableServices = [
    {
      id: "accounting-tax",
      name: t("services.negotiable.accounting.name"),
      description: t("services.negotiable.accounting.description"),
      icon: <Calculator className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.accounting.migration") },
        { name: t("services.negotiable.accounting.taxFiling") },
        { name: t("services.negotiable.accounting.compliance") },
      ],
      request: "Contact us",
    },
    {
      id: "advisory-training",
      name: t("services.negotiable.advisory.name"),
      description: t("services.negotiable.advisory.description"),
      icon: <Lightbulb className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.advisory.tax") },
        { name: t("services.negotiable.advisory.training") },
        { name: t("services.negotiable.advisory.tender") },
      ],
      request: "Contact us",
    },
    {
      id: "document-assistance",
      name: t("services.negotiable.documents.name"),
      description: t("services.negotiable.documents.description"),
      icon: <FileText className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.documents.certificates") },
        { name: t("services.negotiable.documents.ebm") },
        { name: t("services.negotiable.documents.ownership") },
      ],
      request: "Contact us",
    },
    {
      id: "financial-support",
      name: t("services.negotiable.financial.name"),
      description: t("services.negotiable.financial.description"),
      icon: <Users className="h-6 w-6 text-[#fdc901]" />,
      items: [
        { name: t("services.negotiable.financial.loan") },
        { name: t("services.negotiable.financial.website") },
        { name: t("services.negotiable.financial.manuals") },
      ],
      request: "Contact us",
    },
  ];
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleProceedToPayment = (service: any) => {
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

  // Socket connection for payment status updates
  React.useEffect(() => {
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
    <div>
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

      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={ServicesImg}
            alt="pricing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end">
            <h1 className="text-3xl md:text-3xl font-bold text-white mb-8 text-center">
              {t("services.ourServices")}
            </h1>
            {/* <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4  mb-8">
              {t("services.transparentPricing")}
            </p> */}
          </div>
        </div>
      </div>
      <div>
        {/* Fixed Price Services Section */}
        <section className="bg-gray-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-xl font-bold mb-4">
                {t("services.fixedPriceServices")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {fixedServices.map((service) => (
                <div key={service.id} className="p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                    {service.price && (
                      <span className="font-bold">
                        {" "}
                        ({formatPrice(service.price)}
                        {service.isMonthly ? "/month)" : ")"}
                      </span>
                    )}
                  </p>

                  {service.isPayment ? (
                    <button
                      onClick={() => handleProceedToPayment(service)}
                      className="bg-[#fdc901] text-black px-6 py-2 rounded-lg font-semibold hover:text-black transition"
                    >
                      {service.subscribe}
                    </button>
                  ) : (
                    <Link
                      to="/pricing"
                      className="mt-4 bg-[#fdc901] text-black px-6 py-2 rounded-lg font-semibold hover:text-black transition"
                    >
                      {t("about.viewPricing")}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Negotiable Services Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-xl font-bold mb-4">
                {t("services.negotiableServices")}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {negotiableServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-gray-500 mb-2">
                      Services include:
                    </p>
                    <ul className="space-y-2">
                      {service.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-[#fdc901] mr-2" />
                          <span className="text-gray-500">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to="/contact-us"
                    className="flex flex-end bottom-4 right-4 mt-4"
                  >
                    <button className=" bg-[#fdc901] text-white px-6 py-2 rounded-lg font-semibold hover:text-black transition">
                      {service.request}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
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
    </div>
  );
};
