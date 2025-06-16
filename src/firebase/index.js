// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeGCMJcNBcI4EBfKleK45DjTESoAQ60ls",
  authDomain: "cs4u-3076d.firebaseapp.com",
  projectId: "cs4u-3076d",
  storageBucket: "cs4u-3076d.firebasestorage.app",
  messagingSenderId: "683132252148",
  appId: "1:683132252148:web:ddefa89f2650d5e772d3a1"
};

// Initialize Firebase
const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };