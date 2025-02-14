import React, { use } from "react";
import { FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={logo} alt="Logo" className="w-8 sm:w-16" />
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
      >
        Login
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Navbar;
