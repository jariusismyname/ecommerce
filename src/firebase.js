
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBYlw-RyU36Ij7PIc0xL3dUh9pAQmD3ucI",
  authDomain: "ecommerce-app-df590.firebaseapp.com",
  projectId: "ecommerce-app-df590",
  storageBucket: "ecommerce-app-df590.firebasestorage.app",
  messagingSenderId: "822915657184",
  appId: "1:822915657184:web:c747c1020aa69c18640f85",
  measurementId: "G-CRV95B76PG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
