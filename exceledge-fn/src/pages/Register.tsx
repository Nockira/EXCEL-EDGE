import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/vdlogo.png";
import { TextInput } from "../components/common/inputText";
import { RegisterSchema } from "../schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface RegisterFormData {
  firstName: string;
  secondName?: string;
  phoneNumber: string;
  email?: string;
  gender: "Male" | "Female";
  dob: Date;
  password: string;
}

export const UserRegister: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      // Here you would typically make an API call
      console.log("Register data:", data);

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
      <div className="flex justify-center sm:pr-[20%] sm:pb-[2%] sm:pl-[20%] text-white">
        <div className="sm:block hidden bg-green-700 w-[70%] rounded-l-[3%] shadow-md pt-[30%] pl-[3%] pr-[3%] text-center space-y-4">
          <h1 className="text-xl text-center font-bold">
            Welcome to VillageDeals! Thank you for choosing us.
          </h1>
          <p>Provide your personal details to start journey with us.</p>
          <p>Or</p>
          <div>
            <button className="border-2 py-1 px-4 rounded-[20px]">
              <Link to={"/login"}>Log in</Link>
            </button>
          </div>
        </div>
        <div className="bg-white sm:rounded-r-[3%] shadow-md sm:w-[70%] w-full text-black p-6">
          <p className="text-xl font-bold mb-4 text-center text-green-700 ">
            Create Account.
          </p>
          {submitError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <TextInput
              name="firstName"
              label="First name"
              type="text"
              register={register}
              error={errors.firstName?.message}
              disabled={isLoading}
            />
            <TextInput
              name="secondName"
              label="Second name"
              type="text"
              register={register}
              error={errors.secondName?.message}
              disabled={isLoading}
            />
            <TextInput
              name="phoneNumber"
              label="Phone name"
              type="text"
              register={register}
              error={errors.phoneNumber?.message}
              disabled={isLoading}
            />
            <TextInput
              name="email"
              label="Email"
              type="email"
              register={register}
              error={errors.email?.message}
              disabled={isLoading}
            />
            <label htmlFor="">Gender</label>
            <select
              {...register("gender")}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}

            <TextInput
              name="dob"
              label="Date of birth"
              type="date"
              register={register}
              error={errors.dob?.message}
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
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-[20px] hover:bg-green-600 disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign up"}
            </button>
          </form>
          <div className="py-2">
            You have an account? Login{" "}
            <Link
              to={"/login"}
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
