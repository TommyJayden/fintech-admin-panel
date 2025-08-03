// src/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F1C] flex flex-col items-center justify-between px-6 py-16 text-white">
      {/* Main Content Area */}
      <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
        {/* Logo */}
        <div className="bg-[#1A73E8] rounded-full w-32 h-32 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m-3-13a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Welcome to <span className="text-[#F6B800]">GoldBank</span>
          </h1>
          <p className="text-[#A0A6B1] text-lg md:text-xl leading-relaxed max-w-md">
          Securely track and manage your crypto and gold.
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="w-full max-w-sm mt-16">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#F6B800] text-[#0B0F1C] py-4 md:py-5 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl hover:brightness-105 active:scale-[0.98] transition-all duration-300 transform"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}