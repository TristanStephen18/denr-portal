import { auth, db } from "./config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const loaderchanger = document.getElementById("loadergif");

function showModal(message) {
  const modal = document.getElementById("custom-modal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.innerText = message;
  modal.style.display = "block";
}

function hideModal() {
  const modal = document.getElementById("custom-modal");
  modal.style.display = "none";
  loaderchanger.src = "../images/tanap.gif";
}

async function login(username, password) {
  showModal("Logging in...");
  try {
    const admincollection = collection(db, "admins");
    const admindocs = await getDocs(admincollection);
    let userFound = false;

    admindocs.forEach((user) => {
      const data = user.data();
      if (username === data.username && password === data.password) {
        userFound = true;
        signInWithEmailAndPassword(auth, data.email, data.password).then(() => {
          loaderchanger.src = "../images/ok.png";
          showModal(`Login successful! Welcome ${data.username}`);
          setTimeout(() => {
            hideModal();
            if (username === "RPS Chief") {
              window.location.assign("/rpschiefdashboard");
            } else {
              window.location.assign("/evaluator/dashboard");
            }
          }, 1500);
        });
      } else if (username === data.username && password !== data.password) {
        userFound = true;
        loaderchanger.src = "../images/error2.png";
        showModal("Password incorrect. Try again.");
        setTimeout(hideModal, 2000);
      }
    });

    if (!userFound) {
      loaderchanger.src = "../images/error2.png";
      showModal(`User "${username}" does not exist.`);
      setTimeout(hideModal, 2000);
    }
  } catch (error) {
    console.error(error);
    showModal("An error occurred. Please try again.");
    setTimeout(hideModal, 2000);
  }
}

const loginform = document.getElementById("login-form");
loginform.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = loginform["username"].value;
  const password = loginform["password"].value;
  login(username, password);
});
