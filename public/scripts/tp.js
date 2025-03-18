import { db } from "./config.js";
import {
  getDocs,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { toggleapplication } from "./docupdaters.js";
// import (toggleapplication)

const modal = new bootstrap.Modal(document.getElementById("permitModal"));

const permittable = document.getElementById("tp-tables");
const permittablebody = document.getElementById("permittablebody");
const requirementsdiv = document.getElementById("requirements");
// const approvebtn = document.getElementById('approvebtn');
// const rejectbtn = document.getElementById('rejectbtn');

async function gettransportpermits() {
  const options = { month: "long", day: "numeric", year: "numeric" };
  // const formattedDate = dateObj.toLocaleDateString('en-US', options);

  try {
    const tpcollectionref = collection(db, "transport_permit");
    onSnapshot(tpcollectionref, (snapshot) => {
      permittablebody.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          const row = document.createElement("tr");
          if (docdata.status === "Pending") {
            row.setAttribute("permit-num", doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>Transport Permit</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            // Add event listener for modal
            row.addEventListener("click", () => {
              getfiles(`${doc.id.toString()}`).then((sample) => {
                const actionButtonsDiv = document.createElement("div");
                actionButtonsDiv.className = "action-buttons";

                // Create the first button: "Mark as Evaluated"
                const approveBtn = document.createElement("button");
                approveBtn.id = "approvebtn";
                approveBtn.textContent = "Mark as Evaluated";
                approveBtn.onclick = function () {
                  console.log("Marked as Evaluated");
                  toggleapplication(doc.id, docdata.userID, 'approve', 'transport_permit', docdata.client)
                  // You can add more logic here
                };

                // Create the span wrapper for the second button
                const rejectSpan = document.createElement("span");

                // Create the second button: "Reject"
                const rejectBtn = document.createElement("button");
                rejectBtn.id = "rejectbtn";
                rejectBtn.textContent = "Reject";
                rejectBtn.onclick = function () {
                  console.log("Rejected");
                  toggleapplication(doc.id, docdata.userID, 'reject', 'transport_permit', docdata.client)
                  // Add your logic here
                };

                // Append the "Reject" button to the span
                rejectSpan.appendChild(rejectBtn);

                // Append both buttons to the main div
                actionButtonsDiv.appendChild(approveBtn);
                actionButtonsDiv.appendChild(rejectSpan);

                requirementsdiv.appendChild(actionButtonsDiv);
              });
              document.getElementById("modalClient").textContent =
                docdata.client;
              document.getElementById("modalTitle").textContent = doc.id;
              document.getElementById("modalDate").textContent =
                docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);
              // approvebtn.addEventListener('click', toggleapplication(doc.id, docdata.userID, 'approve', 'transport_permit', docdata.client));
              // rejectbtn.addEventListener('click', toggleapplication(doc.id, docdata.userID, 'reject', 'transport_permit', docdata.client));

              document.getElementById("permitModal").classList.remove("hidden");
            });
            // approvebtn.addEventListener('click', toggleapplication);
            permittablebody.appendChild(row);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function getfiles(id) {
  requirementsdiv.innerHTML = "";
  console.log("fetching");
  try {
    const filecollection = collection(
      db,
      `transport_permit/${id}/requirements`
    );
    const filedocs = await getDocs(filecollection);

    filedocs.forEach((fdoc) => {
      const data = fdoc.data();
      console.log("fetching again");

      const { file, fileExtension, fileName } = data;

      if (fileExtension === ".pdf") {
        console.log("pdf found");

        displayPDF(file, fileName);
      } else if (
        fileExtension === ".jpg" ||
        fileExtension === ".jpeg" ||
        fileExtension === ".png"
      ) {
        console.log("images found");

        displayImage(file, fileName);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function displayPDF(base64, filename) {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const icon = document.createElement("h1");
  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item-pdf";
  wrapper.onclick = () => window.open(blobUrl, "_blank");
  icon.innerText = "📄";
  const label = document.createElement("h4");
  label.innerText = `${filename}`;
  wrapper.appendChild(label);
  wrapper.appendChild(icon);
  requirementsdiv.appendChild(wrapper);
}

function displayImage(base64, filename) {
  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item";

  const label = document.createElement("p");
  label.innerText = `🖼️ ${filename}`;
  const img = document.createElement("img");
  img.src = `data:image/jpeg;base64,${base64}`;
  img.alt = filename;

  wrapper.appendChild(label);
  wrapper.appendChild(img);
  wrapper.onclick = () => {
    const newTab = window.open();
    newTab.document.write(
      `<img src="${img.src}" style="width:100%;height:auto;">`
    );
  };

  requirementsdiv.appendChild(wrapper);
}

gettransportpermits();
