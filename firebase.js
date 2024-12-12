// Importando o SDK do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  
    apiKey: "AIzaSyAQAZ5SCdTRzD3fcA7VgHGTP1a5CgHwjXQ",
    authDomain: "chatadudujeje.firebaseapp.com",
    projectId: "chatadudujeje",
    storageBucket: "chatadudujeje.firebasestorage.app",
    messagingSenderId: "879444612031",
    appId: "1:879444612031:web:c2c06762e72bf93e78470a"
  
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando os serviços necessários
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

// Exportando as referências
export { auth, firestore, database };
