import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // <-- 1. YENİLİK: Auth kütüphanesini çağırdık

const firebaseConfig = {
  apiKey: "AIzaSyDAFOUXbXrcAxWwuP9mgPISBA9rRF7pZHA",
  authDomain: "emdr-app-14bde.firebaseapp.com",
  projectId: "emdr-app-14bde",
  storageBucket: "emdr-app-14bde.firebasestorage.app",
  messagingSenderId: "831189874558",
  appId: "1:831189874558:web:bb471d8021fab442daa52f",
  databaseURL: "https://emdr-app-14bde-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app); // <-- 2. YENİLİK: Auth özelliğini kullanıma açtık