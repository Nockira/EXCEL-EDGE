import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { TextInput } from "../components/common/inputText";
import { LoginSchema } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { preventAuthAccess } from "../services/service";
import { SubHeader } from "../components/common/navigator/SubHeader";
import { countries } from "../data/countries";

const api_url = process.env.REACT_APP_API_BASE_URL;

interface LoginFormData {
  phone: string;
  password: string;
}

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface DecodedToken {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  role: string;
  exp: number;
  iat: number;
}

export const Login: React.FC = () => {
  preventAuthAccess();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    countries.find((c) => c.code === "RW")!
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Combine country code with phone number for login
      const loginData = {
        phone: `${selectedCountry.dialCode}${data.phone}`,
        password: data.password,
      };

      const response = await axios.post(`${api_url}/users/login`, loginData);
      localStorage.setItem("accessToken", response.data.accessToken);
      const token: any = localStorage.getItem("accessToken");
      const decoded = jwtDecode<DecodedToken>(token);
      toast.success(
        `${response.data.message} ${decoded.firstName} ${decoded.secondName}` ||
          `Welcome!☺️ ${decoded.firstName} ${decoded.secondName}`
      );
      reset();
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Login failed. Token missing.");
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
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
        <div className="w-full md:w-1/2 lg:w-1/2 max-w-md ">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#fdc901]">
              {t("login.title")}
            </h2>

            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            {/* Google Sign In */}
            <button
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all mb-6"
              onClick={() => {
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

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">
                {t("user_register.or")}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("user_register.phone_number")}
                </label>
                <div className="flex">
                  <div className="relative">
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
                            <span className="text-gray-600">
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
                  label={`${t("user_register.password")}`}
                  type={showPassword ? "text" : "password"}
                  register={register}
                  error={errors.password?.message}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-[#fdc901]"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  to={"/reset-password"}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fdc901] text-white py-3 rounded-full hover:bg-[#e6b800] font-medium transition-colors disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading
                  ? `${t("login.loggingIn")}`
                  : `${t("login.loginButton")}`}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-0 text-center">
              <Link
                to={"/sign-in"}
                className="text-blue-600 hover:underline font-medium"
              >
                {t("login.register")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
