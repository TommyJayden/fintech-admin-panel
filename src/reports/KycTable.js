// src/reports/KycTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function KycTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetch();
  }, []);

  const downloadCSV = () => {
    const headers = ['Full Name', 'Email', 'Wallet Address', 'KYC Status'];
    const rows = users.map(user => [
      user.fullName || 'N/A',
      user.email,
      user.walletAddress,
      user.kycStatus
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'kyc_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="bg-[#F6B800] text-[#0B0F1C] px-4 py-2 rounded-lg font-semibold shadow hover:brightness-105"
        >
          Download CSV
        </button>
      </div>
      <table className="min-w-full bg-white rounded-lg shadow-md text-sm">
        <thead>
          <tr className="bg-[#F6B800] text-[#0B0F1C] text-left">
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Wallet Address</th>
            <th className="p-3">KYC Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.fullName || 'N/A'}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.walletAddress}</td>
              <td className="p-3 capitalize">{user.kycStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}