import { usernamegetter, updateDateTime, sessionchecker } from "./sessionchecker.js";
import { logoutfunction, db } from "./config.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);


const username = document.getElementById("username");
sessionchecker(username);

setInterval(updateDateTime, 1000);

// Map of collection names to their corresponding DOM element IDs
const collectionsToListen = {
  "transport_permit": "tpnum",
  "chainsaw": "crnum",
  "tree_cutting": "tcpnum",
  "wildlife": "wrnum",
  "plantation": "pwprnum", // make sure pwprnum is the correct element ID
};

// Reusable function to set up a listener
function setupSnapshotListener(collectionName, elementId) {
  const colRef = collection(db, collectionName);
  const element = document.getElementById(elementId);
  if (!element) return;

  onSnapshot(colRef, (snapshot) => {
    element.innerHTML = `${snapshot.docs.length}`;
  });
}

// Initialize all listeners
Object.entries(collectionsToListen).forEach(([col, el]) => {
  setupSnapshotListener(col, el);
});

console.log(Date());


