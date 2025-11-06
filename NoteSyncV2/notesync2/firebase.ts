import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOijAamisVVILHfsSRzNb7M60oCl5ncO0",
  authDomain: "notesync-28fb0.firebaseapp.com",
  projectId: "notesync-28fb0",
  storageBucket: "notesync-28fb0.firebasestorage.app",
  messagingSenderId: "796592717661",
  appId: "1:796592717661:web:c46dad5fbb292c9dcbb2b4"
};

const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();    
const db = getFirestore(app);

export { db };