// Fix: Removed unnecessary reference to vite/client types.
// This was causing an error because Vite types are not present in the environment,
// and it's not needed as `import.meta.env` is not being used.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyB0SIJvmMD2hZKIrAZQTYgIhMnEU3Esz_U",
  authDomain: "ai-creative-studio-bc4b0.firebaseapp.com",
  projectId: "ai-creative-studio-bc4b0",
  storageBucket: "ai-creative-studio-bc4b0.appspot.com",
  messagingSenderId: "785563794434",
  appId: "1:785563794434:web:552b1047df1486c146fb1b",
  measurementId: "G-2V040NWBH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;