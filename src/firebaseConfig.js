// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANM89HunUl71ZqehhMzBkJU7ccMHs1VeM",
  authDomain: "ym-asset-confirm.firebaseapp.com",
  projectId: "ym-asset-confirm",
  storageBucket: "ym-asset-confirm.firebasestorage.app",
  messagingSenderId: "1051742227948",
  appId: "1:1051742227948:web:5d8f6c24dc8cfec1c604c9",
  measurementId: "G-8TGJ0EDX9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };