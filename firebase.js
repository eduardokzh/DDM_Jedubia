import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase (obtida do Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCH66cFSKPBoGlb3HFj6ioDlQLAFEE1bro",
  authDomain: "chat-firebase-b03e7.firebaseapp.com",
  databaseURL: "https://chat-firebase-b03e7-default-rtdb.firebaseio.com/",
  projectId: "chat-firebase-b03e7",
  storageBucket: "chat-firebase-b03e7.firebasestorage.app",
  messagingSenderId: "530119849526",
  appId: "1:530119849526:web:f54d36e9c896013f808a97",
  measurementId: "G-M23EEKCEGM"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
