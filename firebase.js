import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASdLKaJj99ACKt-vUowEtw6JHQZS4f4WI",
  authDomain: "streamsphere-e5b78.firebaseapp.com",
  projectId: "streamsphere-e5b78",
  storageBucket: "streamsphere-e5b78.appspot.com",
  messagingSenderId: "905623682386",
  appId: "1:905623682386:web:882cdf1dab108eefcfce8b",
  measurementId: "G-STL3B2WWFV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };