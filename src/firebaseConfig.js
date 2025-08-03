// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANWnAjMGZptZEAPfl8jwTvKu196NviN1c",
  authDomain: "fintech-app1.firebaseapp.com",
  projectId: "fintech-app1",
  storageBucket: "fintech-app1.firebasestorage.app",
  messagingSenderId: "738989268757",
  appId: "1:738989268757:web:5ce694ac8b66fb586b131c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
