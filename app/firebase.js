// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyAuDCHjLLtcq5duFfb-uh9rdVwTGjZRPjY",
 authDomain: "support-chat-87713.firebaseapp.com",
 projectId: "support-chat-87713",
 storageBucket: "support-chat-87713.appspot.com",
 messagingSenderId: "239866081699",
 appId: "1:239866081699:web:ff4170d1c3bf70656d2a16",
 measurementId: "G-3DH63M4EDX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const analytics = getAnalytics(app);


export { auth };
