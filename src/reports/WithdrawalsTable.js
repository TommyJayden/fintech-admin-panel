// src/reports/WithdrawalsTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function WithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'withdrawals'));
      setWithdrawals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetch();
  }, []);

  const downloadCSV = () => {
    const headers = ['User ID', 'Amount', 'Status'];
    const rows = withdrawals.map(w => [w.userId, w.amount, w.status]);

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'withdrawals_report.csv');
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
            <th className="p-3">User ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map(w => (
            <tr key={w.id} className="border-t">
              <td className="p-3">{w.userId}</td>
              <td className="p-3">${w.amount}</td>
              <td className="p-3 capitalize">{w.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
