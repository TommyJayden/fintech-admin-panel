// src/KYCApproval.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function KYCApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/kyc-requests');
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleApprove = async () => {
    await updateDoc(doc(db, 'users', id), { kycStatus: 'completed' });
    navigate('/kyc-requests');
  };

  const handleReject = async () => {
    await updateDoc(doc(db, 'users', id), { kycStatus: 'rejected' });
    navigate('/kyc-requests');
  };

  if (!user) return <p className="text-center mt-10 text-[#8A8F9A]">Loading user data...</p>;

  return (
    <div className="min-h-screen bg-[#f1eadd] text-[#101920] px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">KYC Approval</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">{user.fullName}</h3>
        <p className="text-sm mb-1">Email: {user.email}</p>
        <p className="text-sm mb-1">Phone: {user.phone}</p>
        <p className="text-sm mb-1">Wallet Address: {user.walletAddress}</p>
        <p className="text-sm mb-1">Address: {user.address}</p>
        <p className="text-sm mb-1">ID Type: {user.idType}</p>
        <p className="text-sm mb-4">ID Number: {user.idNumber}</p>

        <div className="flex gap-6 mb-4 flex-wrap">
          {user.idImageUrl && (
            <div>
              <p className="text-xs text-[#8A8F9A] mb-1">ID Image</p>
              <img src={user.idImageUrl} alt="ID" className="w-40 h-28 object-cover rounded-lg border" />
            </div>
          )}
          {user.selfieUrl && (
            <div>
              <p className="text-xs text-[#8A8F9A] mb-1">Selfie</p>
              <img src={user.selfieUrl} alt="Selfie" className="w-40 h-28 object-cover rounded-lg border" />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleApprove}
            className="bg-[#F6B800] text-[#0B0F1C] px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
