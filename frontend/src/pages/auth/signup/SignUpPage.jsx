import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../../../constant/url";
import logo from "../../../assets/knowverse.png";


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/signup`, {
          method: "POST",
          credentials : "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // page won't reload
      console.log("Submitting data:", formData); 
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className=" max-w-screen-xl mx-auto  flex  px-10 bg-white  transition-all lg:h-99 mt-35 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  p-6">
      {/* Left Section (Hidden on Small Screens) */}
      <div className="flex-1 hidden lg:flex items-center justify-center  ">
        <img
          src={logo}
          alt=""
          srcset=""
          className="w-32 sm:w-40 md:w-90 rounded-4xl "
        />
      </div>

      {/* Right Section (Form Area) */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col "
          onSubmit={handleSubmit}
        >
          {/* Mobile Logo */}
          <img
            src={logo}
            alt=""
            srcset=""
            className="w-28 rounded-4xl ml-9 lg:hidden "
          />

          <h1 className="text-4xl font-extrabold">Join today.</h1>

          {/* Email Input */}
          <label className="input input-bordered rounded flex items-center gap-2 bg-gray-100 ">
            <MdOutlineMail className="text-gray-500 dark:text-gray-300" />
            <input
              type="email"
              className="grow bg-transparent focus:outline-none"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          {/* Username & Full Name */}
          <div className="flex gap-4 flex-wrap ">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1 bg-gray-100">
              <FaUser className="text-gray-500 " />
              <input
                type="text"
                className="grow bg-transparent focus:outline-none"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1  bg-gray-100 w-2 ">
              <MdDriveFileRenameOutline className="text-gray-500 dark:text-gray-300" />
              <input
                type="text"
                className="grow bg-transparent focus:outline-none"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>

          {/* Password Input */}
          <label className="input input-bordered rounded flex items-center gap-2 bg-gray-100 ">
            <MdPassword className="text-gray-500 dark:text-gray-300" />
            <input
              type="password"
              className="grow bg-transparent focus:outline-none"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          {/* Sign Up Button */}
          <button className="btn rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 transition">
            {isPending ? "Loading..." : "Sign up"}
          </button>

          {/* Error Message */}
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>

        {/* Already have an account? */}
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4 text-center text-black">
          <p className="text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="text-blue-600 btn rounded-full bg-transparent border border-blue-600  hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400  transition w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
  
export default SignUpPage;
