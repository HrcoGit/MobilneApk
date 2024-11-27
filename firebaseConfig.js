import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDMcbW9NLOnTOxGLHYoVXRrLOfePoVmrY4",
    authDomain: "myapp-efd46.firebaseapp.com",
    projectId: "myapp-efd46",
    storageBucket: "myapp-efd46.firebasestorage.app",
    messagingSenderId: "707802357545",
    appId: "1:707802357545:web:899ceb9f36a6de2244a138",
    measurementId: "G-7CSWHW6VZ0"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };