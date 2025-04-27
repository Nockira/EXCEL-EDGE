import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation<string>();

  if (!isOpen) return null;

  const handleGoBack = () => {
    onClose();
  };

  const handleGoToPayment = () => {
    navigate("/services");
    onPaymentSuccess?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
        <h2 className="text-lg mb-4 text-red-600">{t("payment.title")}</h2>
        <p className="mb-6">{t("payment.description")}</p>
        <div className="flex justify-between gap-4">
          <button
            className="bg-black hover:bg-gray-600 text-white py-2 px-4 rounded-full transition"
            onClick={handleGoBack}
          >
            {t("payment.back")}
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-full transition"
            onClick={handleGoToPayment}
          >
            {t("payment.proceed")}
          </button>
        </div>
      </div>
    </div>
  );
};
