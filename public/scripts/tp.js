import { db } from "./config.js";
import {
  getDocs,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
// import { Modal } from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.esm.min.js";

const modal = new bootstrap.Modal(document.getElementById("permitModal"));

const permittable = document.getElementById("tp-tables");
const permittablebody = document.getElementById("permittablebody");

async function gettransportpermits() {
  const options = { month: "long", day: "numeric", year: "numeric" };
  // const formattedDate = dateObj.toLocaleDateString('en-US', options);

  permittablebody.innerHTML = "";
  try {
    const tpcollectionref = collection(db, "transport_permit");
    onSnapshot(tpcollectionref, (snapshot) => {
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
            const docdata = doc.data();
            const row = document.createElement("tr");
            row.setAttribute("permit-num", doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>Transport Permit</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.cuurent_location}</td>
              <td>${docdata.uploadedAt.toDate().toLocaleDateString('en-US', options)}</td>
            `;
            
            // Add event listener for modal
            row.addEventListener("click", () => {
              document.getElementById("modalClient").textContent = docdata.client;
              document.getElementById("modalPermitId").textContent = doc.id;
              document.getElementById("modalStatus").textContent = docdata.status;
              document.getElementById("modalLocation").textContent = docdata.cuurent_location;
              document.getElementById("modalDate").textContent = docdata.uploadedAt.toDate().toLocaleDateString('en-US', options);
              document.getElementById("permitModal").classList.remove("hidden");
            });
          
            permittablebody.appendChild(row);
          });
          
      }
    });
  } catch (error) {
    console.log(error);
  }
}



gettransportpermits();

// import { Modal } from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.esm.min.js";

// const modal = new bootstrap.Modal(document.getElementById("permitModal"));

// snapshot.forEach((doc) => {
//   const docdata = doc.data();
//   const row = document.createElement("tr");
//   row.setAttribute("permit-num", doc.id);
//   row.innerHTML = `
//     <td>${docdata.client}</td>
//     <td>${doc.id}</td>
//     <td>Transport Permit</td>
//     <td><span class="status">${docdata.status}</span></td>
//     <td>${docdata.cuurent_location}</td>
//     <td>${docdata.uploadedAt.toDate().toLocaleDateString('en-US', options)}</td>
//   `;

//   row.addEventListener("click", () => {
//     document.getElementById("modalClient").textContent = docdata.client;
//     document.getElementById("modalPermitId").textContent = doc.id;
//     document.getElementById("modalStatus").textContent = docdata.status;
//     document.getElementById("modalLocation").textContent = docdata.cuurent_location;
//     document.getElementById("modalDate").textContent = docdata.uploadedAt.toDate().toLocaleDateString('en-US', options);
//     modal.show();
//   });

//   permittablebody.appendChild(row);
// });
