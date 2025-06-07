// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYlw-RyU36Ij7PIc0xL3dUh9pAQmD3ucI",
  authDomain: "ecommerce-app-df590.firebaseapp.com",
  projectId: "ecommerce-app-df590",
  storageBucket: "ecommerce-app-df590.firebasestorage.app",
  messagingSenderId: "822915657184",
  appId: "1:822915657184:web:c747c1020aa69c18640f85",
  measurementId: "G-CRV95B76PG"
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, storage };
