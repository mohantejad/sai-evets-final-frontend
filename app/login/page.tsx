"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import React from "react";
import { loginSuccess } from "@/redux/authSlice";
import Image from "next/image";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const { access, refresh } = await response.json();

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const userResponse = await fetch("http://localhost:8000/auth/users/me/", {
        method: "GET",
        headers: { Authorization: `JWT ${access}` },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      dispatch(loginSuccess({ user: userData }));
      localStorage.setItem("user", JSON.stringify(userData))
      toast.success("Login successful! 🎉");

      reset();
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error?.message || "Login failed! Please try again.");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white border  border-[#81a7e3] rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Image 
              src="/logo2.png" 
              alt="Sai Events" 
              width={100}
              height={100}
              className="w-20 h-20" 
            />
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-center text-[#004aad] uppercase">
          Welcome Back!
        </h2>
        <p className="text-center text-[#004aad]/90">Login to your account</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-y-1 flex-col">
            <label htmlFor="email" className="text-[#004aad]/90">
              Email
            </label>
            <input
              id="email"
              type="text"
              {...register("email", {
                required: "Email is required",
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#004aad]/90 focus:ring-[#004aad]"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-[#004aad]/90">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#004aad]/90 focus:ring-[#004aad]"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link href="/forgot-password">
              <span className="text-sm text-[#004aad] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </Link>
          </div>

          <div className="flex justify-center mt-6 pb-8">
            <motion.button
              type="submit"
              className="px-10 py-2 text-white bg-[#004aad] border border-[#004aad] font-extrabold uppercase tracking-widest rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              disabled={isSubmitting}
            >
              LOGIN
            </motion.button>
          </div>
        </form>

        <p className="mt-4 text-center text-[#004aad]/90">
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            <span className="text-[#004aad] font-semibold hover:underline cursor-pointer uppercase">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
