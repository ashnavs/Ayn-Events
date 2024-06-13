// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider , signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBf12cpvE-DpFBSFRnBvKZXkoPn_EO9piY",
  authDomain: "aynevents-44bf3.firebaseapp.com",
  projectId: "aynevents-44bf3",
  storageBucket: "aynevents-44bf3.appspot.com",
  messagingSenderId: "262650642188",
  appId: "1:262650642188:web:9904128fa2c70024ee5329",
  measurementId: "G-0ELCZ11X93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth , provider , signInWithPopup }