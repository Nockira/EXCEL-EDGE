import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/vdlogo.png";
import { TextInput } from "../components/common/inputText";
import { LoginSchema } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      // Here you would typically make an API call
      console.log("Login data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful login (redirect, set auth state, etc.)
      // For example:
      // await authService.login(data.emailOrPhone, data.password);
      // history.push('/dashboard');

      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError("Invalid credentials. Please try again.");
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
        <img src={logo} alt="Village Deals Logo" width="50" height="50" />
        <span className="text-green-700">VillageDeals</span>
      </Link>
      <div className="flex justify-center sm:pr-[20%] sm:pt-[8%] sm:pb-[2%] sm:pl-[20%] p-[3%] text-white">
        <div className="sm:block hidden bg-green-700 w-[70%] rounded-l-[4%] shadow-md pt-[10%] pl-[3%] pr-[3%] text-center space-y-4">
          <h1 className="text-xl text-center font-bold">
            Welcome back to VillageDeals! We are happy to have you back.
          </h1>
          <p>To keep connected with us, log in with your credentials.</p>
          <p>Or</p>
          <div>
            <button className="border-2 py-1 px-4 rounded-[20px]">
              <Link to={"/sign-in"}>Sign Up</Link>
            </button>
          </div>
        </div>
        <div className="bg-white sm:rounded-r-[4%] shadow-md sm:w-[70%] w-full text-black p-6">
          <p className="text-xl font-bold mb-4 text-center text-green-700 ">
            Login to VillageDeals.
          </p>
          {submitError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <TextInput
              name="emailOrPhone"
              label="Email or Phone number"
              type="text"
              register={register}
              error={errors.emailOrPhone?.message}
              disabled={isLoading}
            />
            <div className="relative">
              <TextInput
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                register={register}
                error={errors.password?.message}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-green-600"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <Link
              to={"/reset-password"}
              className="text-sm text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-[20px] hover:bg-green-600 disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="py-2">
            You don't have an account? Register{" "}
            <Link
              to={"/sign-in"}
              className="text-sm text-green-700 hover:underline"
            >
              Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
