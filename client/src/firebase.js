// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "drivefind-be118.firebaseapp.com",
  projectId: "drivefind-be118",
  storageBucket: "drivefind-be118.appspot.com",
  messagingSenderId: "625598082933",
  appId: "1:625598082933:web:54694539013da01c08ad3c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);