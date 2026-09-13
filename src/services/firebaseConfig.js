import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAg2_lWaOe1Ye2-Krv9IkZPmIGHcyk0cTk",
  authDomain: "clyvo-care-2sem.firebaseapp.com",
  projectId: "clyvo-care-2sem",
  storageBucket: "clyvo-care-2sem.firebasestorage.app",
  messagingSenderId: "933324399653",
  appId: "1:933324399653:web:e737ed7ec6f6da912f4bcc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);