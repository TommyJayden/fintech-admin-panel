// src/reports/LoansTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function LoansTable() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'loans'));
      setLoans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetch();
  }, []);

  const downloadCSV = () => {
    const headers = ['User ID', 'Amount', 'Status', 'Repayment Date'];
    const rows = loans.map(loan => [
      loan.userId,
      loan.amount,
      loan.status,
      loan.repaymentDate?.seconds ? new Date(loan.repaymentDate.seconds * 1000).toLocaleDateString() : 'N/A'
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'loans_report.csv');
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
            <th className="p-3">Repayment Date</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan.id} className="border-t">
              <td className="p-3">{loan.userId}</td>
              <td className="p-3">${loan.amount}</td>
              <td className="p-3 capitalize">{loan.status}</td>
              <td className="p-3">{loan.repaymentDate?.seconds ? new Date(loan.repaymentDate.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
