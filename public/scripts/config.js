import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFduidyaKtw7Ctk0pQf6v4tfRrnxvegwc",
  authDomain: "denr-car-e-services-project.firebaseapp.com",
  projectId: "denr-car-e-services-project",
  storageBucket: "denr-car-e-services-project.firebasestorage.app",
  messagingSenderId: "18324395869",
  appId: "1:18324395869:web:459a14ce43081af1377ab4",
  measurementId: "G-F4N64WP7GX",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


export function logoutfunction (){
  signOut(auth)
  .then(() => {
    Swal.fire({
      title: "Sample",
      text: "Log out successful",
      icon: "success",
    }).then(async (result) => {
      location.assign("/");
    });
  });
}
