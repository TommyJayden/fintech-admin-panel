// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Dashboard from './Dashboard';
import Withdrawals from './Withdrawals';
import KYCApproval from './KYCApproval';
import KycRequests from './KycRequests';
import Loans from './Loans';
import Reports from './Reports';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="/kyc/:id" element={<KYCApproval />} />
        <Route path="/kyc-requests" element={<KycRequests />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}
