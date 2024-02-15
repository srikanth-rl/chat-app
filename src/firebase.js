import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCeBp2aC5M1VE10XqcFv1oOgATeu0XQaWI",
    authDomain: "web-chat-2205.firebaseapp.com",
    projectId: "web-chat-2205",
    storageBucket: "web-chat-2205.appspot.com",
    messagingSenderId: "183644257693",
    appId: "1:183644257693:web:4b070a61ffebba1fdf8374"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();