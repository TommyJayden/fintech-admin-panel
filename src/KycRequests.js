// src/KycRequests.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function KycRequests() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingKycUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const pending = [];

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.kycStatus === 'pending') {
          pending.push({ id: doc.id, ...user });
        }
      });

      setPendingUsers(pending);
    };

    fetchPendingKycUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f1eadd] text-[#101920] px-4 py-6">
      <h2 className="text-xl font-semibold mb-6">Pending KYC Requests</h2>

      {pendingUsers.length === 0 ? (
        <p className="text-center text-[#8A8F9A]">No pending KYC requests found.</p>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="bg-white p-5 rounded-xl shadow">
              <p className="text-sm text-[#8A8F9A] mb-1">User ID</p>
              <p className="font-bold text-lg mb-2">{user.id}</p>
              <button
                onClick={() => navigate(`/kyc/${user.id}`)}
                className="bg-[#F6B800] text-[#0B0F1C] px-4 py-2 rounded-lg font-semibold hover:brightness-105 transition"
              >
                View Full Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
