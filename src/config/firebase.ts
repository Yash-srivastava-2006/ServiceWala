import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCOKN9ylah9Ks8GnR7_V7hGSmbhKzURqIQ",
  authDomain: "servicewala-login-d697d.firebaseapp.com",
  projectId: "servicewala-login-d697d",
  storageBucket: "servicewala-login-d697d.firebasestorage.app",
  messagingSenderId: "69814288641",
  appId: "1:69814288641:web:f2809fecc7f43c160f9b00",
  measurementId: "G-KDCBBX898B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;