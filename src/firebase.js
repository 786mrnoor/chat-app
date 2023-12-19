import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhLt_Qs1xZ8TUbRhwK6V17_C91LgG5Fcg",
  authDomain: "chat-noor.firebaseapp.com",
  projectId: "chat-noor",
  storageBucket: "chat-noor.appspot.com",
  messagingSenderId: "199759756122",
  appId: "1:199759756122:web:6824360d8b9184d8e69163"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();