// src/Loans.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function Loans() {
  const [pendingLoans, setPendingLoans] = useState([]);

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    const snapshot = await getDocs(collection(db, 'loans'));
    const pending = [];

    for (const loanDoc of snapshot.docs) {
      const loan = loanDoc.data();

      if (loan.status === 'pending') {
        let userInfo = {
          fullName: 'Unknown',
          email: 'N/A',
          address: 'N/A',
        };

        try {
          const userSnap = await getDoc(doc(db, 'users', loan.userId));
          if (userSnap.exists()) {
            const user = userSnap.data();
            userInfo = {
              fullName: user.fullName || 'Unknown',
              email: user.email || 'N/A',
              address: user.address || 'N/A',
            };
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

        pending.push({
          id: loanDoc.id,
          ...loan,
          ...userInfo,
        });
      }
    }

    setPendingLoans(pending);
  };

  const handleApprove = async (loanId) => {
    await updateDoc(doc(db, 'loans', loanId), { status: 'approved' });
    fetchPendingLoans();
  };

  const handleReject = async (loanId) => {
    await updateDoc(doc(db, 'loans', loanId), { status: 'rejected' });
    fetchPendingLoans();
  };

  return (
    <div className="min-h-screen bg-[#f1eadd] text-[#101920] px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Pending Loan Requests</h2>

      {pendingLoans.length === 0 ? (
        <p className="text-center text-[#8A8F9A]">No pending loans found.</p>
      ) : (
        <div className="grid gap-6">
          {pendingLoans.map(loan => (
            <div key={loan.id} className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-sm text-[#8A8F9A] mb-1">User ID:</p>
              <p className="font-bold text-lg mb-2">{loan.userId}</p>

              <p className="text-sm">Full Name: <span className="font-semibold">{loan.fullName}</span></p>
              <p className="text-sm">Email: <span className="font-semibold">{loan.email}</span></p>
              <p className="text-sm mb-2">Address: <span className="font-semibold">{loan.address}</span></p>

              <p className="text-sm">Loan Amount: <span className="font-semibold">${loan.amount}</span></p>
              <p className="text-sm mb-3">
                Repayment Date:{' '}
                <span className="font-semibold">
                  {loan.repaymentDate?.seconds
                    ? new Date(loan.repaymentDate.seconds * 1000).toLocaleDateString()
                    : 'N/A'}
                </span>
              </p>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleApprove(loan.id)}
                  className="bg-[#F6B800] text-[#0B0F1C] px-4 py-2 rounded-lg font-semibold hover:brightness-105 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(loan.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
