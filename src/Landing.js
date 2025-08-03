// src/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/22bank-logo.png'; // <- update if your file is in another folder

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eae6db] flex flex-col items-center justify-between px-6 py-16 text-white">
      {/* Main Content Area */}
      <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
        {/* Logo Display (no circle, full size) */}
        <div className="w-full flex justify-center">
          <img
            src={logo}
            alt="22 Bank Logo"
            className="h-33 md:h-32 object-contain"
          />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#101920]">
            Welcome to <span className="text-[#F6B800]">22 BANK</span>
          </h1>
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
