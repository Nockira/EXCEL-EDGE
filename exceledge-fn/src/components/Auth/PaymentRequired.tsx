import React from "react";
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
        <h2 className="text-lg mb-4 text-red-600">Payment Required*</h2>
        <p className="mb-6">
          You need to complete payment to access this service.
        </p>
        <div className="flex justify-between gap-4">
          <button
            className="bg-black hover:bg-gray-600 text-white py-2 px-4 rounded-full transition"
            onClick={handleGoBack}
          >
            Go Back
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-full transition"
            onClick={handleGoToPayment}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};
