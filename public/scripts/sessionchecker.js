import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
// import { doc } from "firebase/firestore";

let id = "";

export function sessionchecker(elemendId, pfpid) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User is logged in");
      id = user.uid;

      let username = "Default";
      try {
        const userdocref = doc(db, "admins", user.uid);
        console.log(userdocref);
        const snapshot = await getDoc(userdocref);
        console.log(snapshot.data());
        username = snapshot.data().username;

        elemendId.innerText = `${username}`;
        if(username === 'admin1'){
          pfpid.src = "../images/admin1.jpg";
        }
        else if(username === "RPS Chief"){
          pfpid.src = "../images/rpschieficon_d.jpg";
        }else{
          pfpid.src = "../images/adminp.png";
        }
      } catch (error) {
        console.error(error);
      }
      // window.location.assign("/dashboard");
    } else {
      console.log("Nobody is logged in");
      window.location.assign("/");
    }

  });
}

export async function usernamegetter(uid) {
  let username = "Default";
  try {
    const userdocref = doc(db, "admins", uid);
    console.log(userdocref);
    const snapshot = await getDoc(userdocref);
    console.log(snapshot.data());
    username = snapshot.data().username;
  } catch (error) {
    console.error(error);
  }

  return username;
}

export function updateDateTime() {
  const optionsDate = { year: "numeric", month: "long", day: "numeric" };
  const optionsTime = { hour: "2-digit", minute: "2-digit", second: "2-digit" };

  const datenow = new Date();
  const formattedDate = datenow.toLocaleDateString("en-US", optionsDate);
  const formattedTime = datenow.toLocaleTimeString("en-US", optionsTime);

  const finalFormattedDate = `${formattedDate}, ${formattedTime}`;

  // Update the element where you want to display the date and time
  document.getElementById("datenow").textContent = finalFormattedDate;
}
