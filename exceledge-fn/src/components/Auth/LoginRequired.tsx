import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation<string>();

  if (!isOpen) return null;

  const handleGoBack = () => {
    onClose();
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg mb-4 text-red-600">{t("auth.requiredTitle")}</h2>
        <p className="mb-6">{t("auth.requiredDescription")}</p>
        <div className="flex justify-between">
          <button
            className="bg-gray-900 text-white py-2 px-4 rounded-full"
            onClick={handleGoBack}
          >
            {t("auth.goBack")}
          </button>
          <button
            className="bg-yellow-600 text-white py-2 px-4 rounded-full"
            onClick={handleGoToLogin}
          >
            {t("auth.goToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
};
