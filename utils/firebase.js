import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD0fp6vheCYZhJxElid2kdZsARnXAuW4X0",
    authDomain: "pdf-project-7030f.firebaseapp.com",
    projectId: "pdf-project-7030f",
    storageBucket: "pdf-project-7030f.firebasestorage.app",
    messagingSenderId: "366162737074",
    appId: "1:366162737074:web:7d4cd14e62e727cfaf96ab",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);