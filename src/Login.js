// src/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔍 Fetch user document from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === 'admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: You are not an admin.');
      }
    } catch (err) {
      setError('Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eae6db] px-4 py-16">
      <div className="w-full max-w-sm space-y-10">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#0B0F1C]">Admin Portal</h2>
          <p className="text-sm text-[#4E4E4E]">Secure access to your GoldBank dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@goldbank.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#F6B800] text-[#0B0F1C] font-bold py-3 rounded-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-300"
            >
              Login
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
