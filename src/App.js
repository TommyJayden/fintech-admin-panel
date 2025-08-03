// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div className="text-white bg-black h-screen flex items-center justify-center">Welcome to Admin Dashboard</div>} />
      </Routes>
    </Router>
  );
}
