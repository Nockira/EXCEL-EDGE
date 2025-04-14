import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/vdlogo-removebg-preview.png";
import axios from "axios";
import { toast } from "react-toastify";
import { TextInput } from "../components/common/inputText";
import { RegisterSchema } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
const api_url = process.env.REACT_APP_API_BASE_URL;
interface RegisterFormData {
  phone: string;
  password: string;
}

export const UserRegister: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await axios.post(`${api_url}/v1/users`, data);
      toast.success(response.data.message || "Registration successful! 🎉");
      reset();
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`${`${t("errors.registration_failed")}`}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1 bg-gray-200 min-h-screen">
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold pt-[1%] pl-[4%]"
      >
        <img src={logo} alt="Village Deals Logo" width="160" height="160" />
      </Link>
      <div className="flex justify-center sm:pr-[20%] sm:pb-[4%] sm:pl-[20%] text-white">
        <div className="bg-white sm:rounded-[3%] shadow-md sm:w-[70%] w-full text-black p-6">
          <p className="text-xl font-bold mb-4 text-center text-[#fdc901] ">
            {t("user_register.create_account")}
          </p>
          {submitError && (
            <div className="mb-4 p-2 bg-red-100 text-red-500 rounded">
              {submitError}
            </div>
          )}
          <button
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-[#757575] font-medium py-2.5 px-4 rounded-full hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 mb-4 transition-all"
            onClick={() => {
              setGoogleLoading(true);
              window.location.href = `${api_url}/users/google-auth`;
            }}
          >
            <svg
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span>{t("user_register.sign_up_with_google")}</span>
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">
              {t("user_register.or")}
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput
              name="phone"
              label={`${t("user_register.phone_number")}`}
              type="text"
              register={register}
              error={errors.phone?.message}
              disabled={isLoading}
            />

            <div className="relative">
              <TextInput
                name="password"
                label={`${t("user_register.password")}`}
                type={showPassword ? "text" : "password"}
                register={register}
                error={errors.password?.message}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-[#fdc901]"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#fdc901] text-white py-2 rounded-[20px] hover:bg-[#fdc901] disabled:bg-yellow-400"
              disabled={isLoading}
            >
              {isLoading
                ? `${`${t("user_register.processing")}`}`
                : `${`${t("user_register.sign_up")}`}`}
            </button>
          </form>

          <div className="py-2 text-center">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-[#fdc901] hover:underline font-medium"
            >
              {t("user_register.log_in_here")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
