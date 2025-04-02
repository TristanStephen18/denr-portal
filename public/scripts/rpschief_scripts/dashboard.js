import { updateDateTime, sessionchecker } from "../sessionchecker.js";
import { logoutfunction, db } from "../config.js";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  allpermitscollectionref,
  collectionsToListen,
} from "../constants/firebaseconstants.js";
// import { status } from "express/lib/response.js";

import { setPermitRows, searching } from "../datahelpers.js";

const options = { month: "long", day: "numeric", year: "numeric" };
const tablebodyid = document.getElementById("evaluatedtbody");
const modal = document.getElementById("evaluatedmodal");
const statusfilter = document.getElementById("status");
const searchdata = document.getElementById("searchdata");

searchdata.addEventListener("input", () => {
  // console.log(searchdata.value);

  searching(searchdata);
});

async function updaterow(updateto) {
  try {
    updateDoc(doc(db, "chainsaw", "CH-2025-03-20-0001"), {
      status: updateto,
    });
  } catch (error) {
    console.error(error);
  }
}

allpermitscollectionref.forEach((collectionref) => {
  console.log(collectionref);
});

const username = document.getElementById("username");
const pfpid = document.getElementById("pfp");

pfpid.addEventListener("click", () => {
  logoutfunction();
});

window.onload = initializepage;

function initializepage() {
  setInterval(updateDateTime, 1000);
  sessionchecker(username, pfpid);
  Object.entries(collectionsToListen).forEach(([col]) => {
    setupSnapshotListener(col);
    // getevaluatedpermits(col);
  });
}

let evaluatedPermitsMap = new Map(); // Store permit data with document ID as the key

function setupSnapshotListener(collectionName) {
  const colRef = collection(db, collectionName);

  onSnapshot(colRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const doc = change.doc;
      const data = doc.data();

      if (data.status === "Evaluated") {
        const permit = {
          id: doc.id,
          client: data.client,
          permit_number: doc.id,
          permit_type: getPermitType(collectionName),
          status: data.status,
          evaluated_by: data.evaluated_by,
          evaluated_at: data.evaluated_at
            ? data.evaluated_at.toDate().toLocaleDateString("en-us", options)
            : "N/A",
          current_location: data.current_location || "Unknown",
          date_created: data.uploadedAt
            ? data.uploadedAt.toDate().toLocaleDateString("en-us", options)
            : "Unknown",
        };

        if (!evaluatedPermitsMap.has(doc.id)) {
          evaluatedPermitsMap.set(doc.id, permit);
        }
      } else {
        evaluatedPermitsMap.delete(doc.id);
      }
    });

    renderTable("All");
  });
}

// Helper function to get permit type
function getPermitType(collectionName) {
  switch (collectionName) {
    case "transport_permit":
      return "Transport Permit";
    case "tree_cutting":
      return "Tree Cutting Permit";
    case "plantation":
      return "Plantation and Wood Processing Registration";
    case "wildlife":
      return "Wildlife Registration";
    default:
      return "Chainsaw Registration / Permit";
  }
}

// Function to update the table
function renderTable(filter) {
  tablebodyid.innerHTML = ""; // Clear existing table rows

  // Convert map values to an array and sort by evaluated_at (latest first)
  const sortedPermits = Array.from(evaluatedPermitsMap.values()).sort(
    (a, b) => {
      const dateA = new Date(a.evaluated_at);
      const dateB = new Date(b.evaluated_at);
      return dateB - dateA;
    }
  );

  // Add sorted rows to the table
  sortedPermits.forEach((permit) => {
    const row = document.createElement("tr");

    if (permit.permit_type === filter) {
      row.innerHTML = `
      <td>${permit.client}</td>
      <td>${permit.permit_number}</td>
      <td>${permit.permit_type}</td>
      <td>${permit.status}</td>
      <td>${permit.evaluated_by}</td>
      <td>${permit.evaluated_at}</td>
      <td>${permit.current_location}</td>
      <td>${permit.date_created}</td>
    `;

      // Click event to update status to "Pending"
      row.addEventListener("click", async () => {
        modal.style.display = "block";
      });
    } else if (filter === "All") {
      row.innerHTML = `
      <td>${permit.client}</td>
      <td>${permit.permit_number}</td>
      <td>${permit.permit_type}</td>
      <td>${permit.status}</td>
      <td>${permit.evaluated_by}</td>
      <td>${permit.evaluated_at}</td>
      <td>${permit.current_location}</td>
      <td>${permit.date_created}</td>
    `;

      // Click event to update status to "Pending"
      row.addEventListener("click", async () => {
        modal.style.display = "block";
      });
    }

    tablebodyid.appendChild(row);
  });

  const allPendingRows = Array.from(tablebodyid.querySelectorAll("tr"));
  setPermitRows(allPendingRows);
}

//filtering

statusfilter.addEventListener("change", () => {
  // console.log("changed");
  // console.log(statusfilter.value);

  renderTable(statusfilter.value);
});
