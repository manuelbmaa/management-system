"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting to home...",
        });
        router.push("/home"); // return to home
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: res?.error || "Invalid credentials",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-gray-800/90 border border-gray-700 shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-gray-900 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(bg.svg)`,
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-white">
                Welcome, Back!
              </h1>
              <p className="text-[12px] text-gray-400">
                Please enter your email and password to log into your account
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-700 border border-gray-600 placeholder-gray-400 text-sm text-white focus:outline-none focus:border-green-500 focus:bg-gray-800"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-700 border border-gray-600 placeholder-gray-400 text-sm text-white focus:outline-none focus:border-green-500 focus:bg-gray-800"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="mt-5 tracking-wide font-semibold bg-green-600 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span className="ml-3">Log In</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
  );
};

export default LoginForm;
