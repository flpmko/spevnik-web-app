import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "spevnik-app.firebaseapp.com",
  projectId: "spevnik-app",
  storageBucket: "spevnik-app.appspot.com",
  messagingSenderId: "561541060053",
  appId: "1:561541060053:web:71066350723b9b6239195c",
  measurementId: "G-P4735N3K49",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
