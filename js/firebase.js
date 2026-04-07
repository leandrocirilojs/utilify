// ============================================
// FRETEX — firebase.js
// Configuração e inicialização do Firebase
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ⚠️ SUBSTITUA com suas credenciais do Firebase Console
// https://console.firebase.google.com → Configurações do projeto → Seus apps
const // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUXluCv1WiVG4l9-VfO-MuEmKdQombQuE",
  authDomain: "fretex-b6a66.firebaseapp.com",
  projectId: "fretex-b6a66",
  storageBucket: "fretex-b6a66.firebasestorage.app",
  messagingSenderId: "311626266080",
  appId: "1:311626266080:web:0bed5cd36bba720c19e785",
  measurementId: "G-HD4H3SFX1Q"
};

const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
