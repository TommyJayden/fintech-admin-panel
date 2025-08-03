// src/reports/DepositsTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function DepositsTable() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      const snapshot = await getDocs(collection(db, 'deposits'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDeposits(data);
    };

    fetchDeposits();
  }, []);

  const downloadCSV = () => {
    if (deposits.length === 0) return;

    const headers = Object.keys(deposits[0]);
    const csvRows = [
      headers.join(','), // header row
      ...deposits.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? '')).join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'deposits_report.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">All Deposits</h3>
        <button
          onClick={downloadCSV}
          className="bg-[#F6B800] text-[#0B0F1C] px-4 py-2 rounded-lg font-semibold hover:brightness-105 transition"
        >
          Download CSV
        </button>
      </div>

      {deposits.length === 0 ? (
        <p className="text-center text-[#8A8F9A]">No deposits yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-[#F6B800] text-[#0B0F1C] text-left">
              <tr>
                <th className="py-2 px-4">User ID</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Method</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b">
                  <td className="py-2 px-4">{deposit.userId || 'N/A'}</td>
                  <td className="py-2 px-4">${deposit.amount}</td>
                  <td className="py-2 px-4">{deposit.method || 'Manual'}</td>
                  <td className="py-2 px-4">
                    {deposit.createdAt?.seconds
                      ? new Date(deposit.createdAt.seconds * 1000).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
