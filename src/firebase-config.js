// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCIv6kfn0hV3pZ81GxZo0wgiNVoRzmnUAY",
    authDomain: "my-app-2f326.firebaseapp.com",
    projectId: "my-app-2f326",
    storageBucket: "my-app-2f326.firebasestorage.app",
    messagingSenderId: "803862851313",
    appId: "1:803862851313:web:0a28bf6b79e3ef28c80350"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
