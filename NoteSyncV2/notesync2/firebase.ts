
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";;

const firebaseConfig = {
  apiKey: "AIzaSyDMdoT7Sdx2yn2xONq6pWkrXcF7Ad9NyT8",
  authDomain: "profiling-system-86336.firebaseapp.com",
  projectId: "profiling-system-86336",
  storageBucket: "profiling-system-86336.firebasestorage.app",
  messagingSenderId: "718607026344",
  appId: "1:718607026344:web:b4bb44792814a90634da9d",
  measurementId: "G-ZGV56N4H2G"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();    
const db = getFirestore(app);

export { db };