import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { TextInput } from "../components/common/inputText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useTranslation } from "react-i18next";
import { preventAuthAccess } from "../services/service";
import { SubHeader } from "../components/common/navigator/SubHeader";
import { countries } from "../data/countries";
import { RegisterSchema } from "../schemas/authSchema";
import { jwtDecode } from "jwt-decode";
const api_url =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

interface RegisterFormData {
  phone: string;
  password: string;
  firstName: string;
  secondName: string;
}

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface DecodedToken {
  secondName: string;
  firstName: string;
  role: string;
  exp: number;
  iat: number;
}

export const UserRegister: React.FC = () => {
  useEffect(() => {
    preventAuthAccess();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    countries.find((c) => c.code === "RW") || countries[0]
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    secondName: string;
  } | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".country-dropdown-container")) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmitStep1 = async () => {
    const isValid = await trigger(["phone", "password"]);
    if (isValid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const payload = {
        phone: `${selectedCountry.dialCode}${data.phone}`,
        password: data.password,
        firstName: data.firstName,
        secondName: data.secondName,
      };

      const response = await axios.post(`${api_url}/users`, payload);
      localStorage.setItem("accessToken", response.data.token);
      const decodedToken = jwtDecode<DecodedToken>(response.data.token);
      const userRole = decodedToken.role;
      localStorage.setItem(
        "userData",
        JSON.stringify({
          firstName: response.data.firstName,
          secondName: response.data.secondName,
          role: userRole,
        })
      );
      setUserData({
        firstName: data.firstName,
        secondName: data.secondName,
      });
      toast.success(
        <div>
          <p className="font-bold">
            {t(`registration.welcome`)} {decodedToken.firstName}{" "}
            {decodedToken.secondName}{" "}
          </p>
          <p>{t("registration.success_message")}</p>
        </div>,
        {
          autoClose: 5000,
          closeButton: true,
        }
      );
      const redirectPath = userRole === "ADMIN" ? "/admin-dashboard" : "/";
      setTimeout(() => {
        navigate(redirectPath);
      }, 3000);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("errors.registration_failed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = `${api_url}/users/google-auth`;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-black text-yellow-300">
        <SubHeader />
      </div>
      <div className="flex flex-col md:flex-row flex-1 pt-16 gap-6">
        <div className="ml-[8%] w-full md:w-1/2 lg:w-1/2 md:justify-end">
          <div className="sm:block hidden pr-[30%]">
            <h1 className="font-bold text-xl">{t("tin_management.welcome")}</h1>
            <div className="py-2 text-lg">
              <p className="py-2 flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500" />
                {t("tin_management.tin")}
              </p>
              <p className="py-2 flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500" />
                {t("tin_management.google")}
              </p>
              <p className="py-2 flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500" />
                {t("tin_management.library")}
              </p>
              <p className="py-2 flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500" />
                {t("tin_management.accounting_services")}
              </p>
              <p className="py-2 flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500" />
                etc...
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 max-w-md px-4 md:px-0">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-xl font-bold mb-4 text-center text-[#fdc901]">
              {t("user_register.create_account")}
            </p>
            <button
              disabled={googleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-500 text-[#757575] font-medium py-2.5 px-4 rounded-full hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 mb-4 transition-all"
              onClick={handleGoogleAuth}
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
              <span>
                {googleLoading
                  ? t("user_register.connecting")
                  : t("user_register.sign_up_with_google")}
              </span>
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">
                {t("user_register.or")}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {step === 1 ? (
              <form
                onSubmit={handleSubmit(onSubmitStep1)}
                className="space-y-4"
                noValidate
              >
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("user_register.phone_number")}
                  </label>
                  <div className="flex">
                    <div className="relative country-dropdown-container">
                      <button
                        type="button"
                        className="flex items-center justify-between w-28 px-3 py-2 bg-white border border-r-0 border-gray-600 rounded-l-full focus:outline-none focus:ring-1 focus:ring-[#fdc901]"
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                      >
                        <span className="mr-2">{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {showCountryDropdown && (
                        <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {countries.map((country) => (
                            <div
                              key={country.code}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCountrySelect(country)}
                            >
                              <span className="mr-2">{country.flag}</span>
                              <span className="mr-2">{country.dialCode}</span>
                              <span className="text-gray-600 text-sm truncate">
                                {country.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="712345678"
                      className="flex-1 block w-full px-3 py-2 border border-gray-600 rounded-r-full focus:outline-none focus:ring-1 focus:ring-[#fdc901] disabled:bg-gray-100"
                      {...register("phone")}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <TextInput
                    name="password"
                    label={String(t("user_register.password"))}
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
                  onClick={onSubmitStep1}
                  type="submit"
                  className="w-full bg-[#fdc901] text-white py-2 rounded-[20px] hover:bg-[#fdc901] disabled:bg-yellow-400"
                  disabled={isLoading}
                >
                  {t("user_register.continue")}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span>{t("user_register.step_2_of_2")}</span>
                </div>

                <TextInput
                  name="firstName"
                  placeholder={
                    t("user_register.first_name_placeholder") as string
                  }
                  label={t("user_register.first_name") as string}
                  type="text"
                  register={register}
                  error={errors.firstName?.message}
                  disabled={isLoading}
                />

                <TextInput
                  name="secondName"
                  placeholder={
                    t("user_register.last_name_placeholder") as string
                  }
                  label={t("user_register.last_name") as string}
                  type="text"
                  register={register}
                  error={errors.secondName?.message}
                  disabled={isLoading}
                />

                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-700">
                    {t("user_register.phone_number")}
                  </p>
                  <p className="text-gray-600">
                    {selectedCountry.dialCode} {watch("phone")}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#fdc901] text-white py-2 rounded-[20px] hover:bg-[#fdc901] disabled:bg-yellow-400"
                  disabled={isLoading}
                >
                  {isLoading
                    ? t("user_register.processing")
                    : t("user_register.complete_registration")}
                </button>
              </form>
            )}

            <div className="py-2 text-center">
              {t("alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                {t("user_register.log_in_here")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
