
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  export const firebaseConfig = {
    apiKey: "AIzaSyAAIJNe4mQP99XsjJzmSajfztsHpn8VyXg",
    authDomain: "modulel-2-hackathon.firebaseapp.com",
    projectId: "modulel-2-hackathon",
    storageBucket: "modulel-2-hackathon.firebasestorage.app",
    messagingSenderId: "154131240684",
    appId: "1:154131240684:web:904d8325d2ffcb8c39b7c9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export them so other files can import
export { app, auth, db, storage };
