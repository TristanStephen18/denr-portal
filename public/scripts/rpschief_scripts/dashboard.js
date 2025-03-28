import { updateDateTime, sessionchecker } from "../sessionchecker.js";
import { logoutfunction, db } from "../config.js";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  allpermitscollectionref,
  collectionsToListen,
} from "../constants/firebaseconstants.js";

let forinitializationpermits = [];
const options = { month: "long", day: "numeric", year: "numeric" };
const tablebodyid = document.getElementById('evaluatedtbody');

allpermitscollectionref.forEach((collectionref) => {
  console.log(collectionref);
});

const username = document.getElementById("username");
const pfpid = document.getElementById("pfp");

pfpid.addEventListener('click', ()=>{
    logoutfunction();
})

window.onload = initializepage;

function initializepage() {
  setInterval(updateDateTime, 1000);
  sessionchecker(username, pfpid);
  Object.entries(collectionsToListen).forEach(([col, el]) => {
    setupSnapshotListener(col, el);
    // getevaluatedpermits(col);
  });
}

function setupSnapshotListener(collectionName, elementId) {
  let counter = 0;
  const colRef = collection(db, collectionName);
  const element = document.getElementById(elementId);
  if (!element) return;
  onSnapshot(colRef, (snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "Evaluated") {
        console.log(doc.id);
      }
    });
  });
}

function getevaluatedpermits(collectionName) {
  let typefinder = "";
  const colRef = collection(db, collectionName);

  if (collectionName === "transport_permit") {
    typefinder = "Transport Permit";
  } else if (collectionName === "tree_cutting") {
    typefinder = "Tree Cutting Permit";
  } else if (collectionName === "plantation") {
    typefinder = "Plantation and Wood Processing Registration";
  } else if (collectionName === "wildlife") {
    typefinder = "Wildlife Registration";
  } else {
    typefinder = "Chainsaw Registration / Permit";
  }

  onSnapshot(colRef, (snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "Evaluated") {
        console.log(doc.id);
        const evaluatedpermits = {
          client: data.client,
          permit_number: doc.id,
          permit_type: typefinder,
          status: data.status,
          evaluated_by: data.evaluated_by,
          evaluated_at: data.evaluated_at
            .toDate()
            .toLocaleDateString("en-us", options),
          current_location: data.current_location,
          date_created: data.uploadedAt,
        };

        forinitializationpermits.push(evaluatedpermits);
      }
    });
  });

  console.log(forinitializationpermits);
}
