// src/Withdrawals.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function Withdrawals() {
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      const querySnapshot = await getDocs(collection(db, 'withdrawals'));
      const withdrawals = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') {
          withdrawals.push({ id: doc.id, ...data });
        }
      });

      setPendingWithdrawals(withdrawals);
    };

    fetchWithdrawals();
  }, []);

  const handleApprove = async (withdrawalId) => {
    const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
    await updateDoc(withdrawalRef, {
      status: 'approved',
    });

    setPendingWithdrawals((prev) =>
      prev.filter((w) => w.id !== withdrawalId)
    );
  };

  return (
    <div className="min-h-screen bg-[#f1eadd] text-[#101920] px-4 py-6">
      <h2 className="text-xl font-semibold mb-6">Pending Withdrawals</h2>

      {pendingWithdrawals.length === 0 ? (
        <p className="text-center text-[#8A8F9A]">No pending withdrawals.</p>
      ) : (
        <div className="space-y-4">
          {pendingWithdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="bg-white p-5 rounded-xl shadow-md flex flex-col space-y-2"
            >
              <div className="flex justify-between">
                <p className="font-bold text-[#101920]">User ID:</p>
                <p className="font-bold">{withdrawal.userId}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#8A8F9A]">Amount:</p>
                <p className="text-[#101920] font-semibold">${withdrawal.amount}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#8A8F9A]">Wallet Address:</p>
                <p className="text-[#101920] font-semibold">{withdrawal.walletAddress}</p>
              </div>
              <button
                onClick={() => handleApprove(withdrawal.id)}
                className="mt-4 bg-[#F6B800] text-[#0B0F1C] py-2 px-4 rounded-lg font-semibold hover:brightness-105 transition"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
