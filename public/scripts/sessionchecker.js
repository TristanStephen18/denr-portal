import { auth, db } from "./config.js";
import {
  getDocs,
  collection,
  doc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

let id;

function sessionchecker() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in");
      id = user.uid;
      // window.location.assign("/dashboard");
    } else {
      console.log('Nobody is logged in');
      // window.location.assign("/");
    }
  });
}

sessionchecker();

export function usernamegetter (){
  return "Admin1";
  // try{
  //   const userdocref = doc(db, 'admins', id);
  //   console.log(userdocref);
    
  // }catch(error){
  //   console.error(error)
  // }
}

export function updateDateTime() {
  const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const datenow = new Date();
  const formattedDate = datenow.toLocaleDateString('en-US', optionsDate);
  const formattedTime = datenow.toLocaleTimeString('en-US', optionsTime);

  const finalFormattedDate = `${formattedDate}, ${formattedTime}`;
  
  // Update the element where you want to display the date and time
  document.getElementById('datenow').textContent = finalFormattedDate;
}
