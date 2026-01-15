import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDAFOUXbXrcAxWwuP9mgPISBA9rRF7pZHA",
  authDomain: "emdr-app-14bde.firebaseapp.com",
  projectId: "emdr-app-14bde",
  storageBucket: "emdr-app-14bde.firebasestorage.app",
  messagingSenderId: "831189874558",
  appId: "1:831189874558:web:bb471d8021fab442daa52f",
  // İŞTE EKSİK PARÇA BURASIYDI:
  databaseURL: "https://emdr-app-14bde-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);