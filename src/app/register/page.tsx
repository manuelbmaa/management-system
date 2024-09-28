"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import Swal from "sweetalert2";

const RegistrationForm = () => {
  const [role, setRole] = useState("TeamMember");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const signupResponse = await axios.post("/api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        fullname: formData.get("fullname"),
        role: formData.get("role"),
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: signupResponse.data.message,
      });

      // return to dashboard after user's registration
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data.message || "Unknown error",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
        <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
          <div className="flex-1 bg-green-900 text-center hidden md:flex">
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
                <h1 className="text-2xl xl:text-4xl font-extrabold text-green-900">
                  Create users
                </h1>
                <p className="text-[12px] text-gray-500">
                  Hey, enter the details to create an account for a user
                </p>
              </div>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs flex flex-col gap-4">
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 focus:bg-white"
                    type="text"
                    name="fullname"
                    placeholder="Full name"
                  />
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 focus:bg-white"
                    type="email"
                    name="email"
                    placeholder="Mail"
                  />
                  <select
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:bg-white"
                    value={role}
                    name="role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="TeamMember">Team Member</option>
                    <option value="ProjectManager">Project Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 focus:bg-white"
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <button className="mt-5 tracking-wide font-semibold bg-green-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                    <span className="ml-3">Sign Up</span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    Already have an account?{" "}
                    <a href="">
                      <span className="text-green-900 font-semibold">
                        Sign in
                      </span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
