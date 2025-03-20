import { db, auth } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { getfiles } from "./decoder.js";

let allRows = [];
let username = "No user";

export function searching(searchfilter) {
  const query = searchfilter.value.toLowerCase();

  allRows.forEach((row) => {
    const textContent = row.textContent.toLowerCase();
    if (textContent.includes(query)) {
      row.style.display = ""; // show the row
    } else {
      row.style.display = "none"; // hide the row
    }
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in");

    try {
      const userdocref = doc(db, "admins", user.uid);
      console.log(userdocref);
      const snapshot = await getDoc(userdocref);
      console.log(snapshot.data());
      username = snapshot.data().username;
    } catch (error) {
      console.error(error);
    }
    // window.location.assign("/dashboard");
  } else {
    console.log("Nobody is logged in");
  }
});

function setPermitRows(rowsArray) {
  allRows = rowsArray;
}

export async function toggleapplication(
  permitid,
  userid,
  changeto,
  permittype,
  client
) {
  const admindoc = doc(db, `${permittype}`, permitid);
  const userdoc = doc(db, `mobile_users/${userid}/applications`, permitid);

  try {
    if (changeto === "reject") {
      Swal.fire({
        title: `Do you want to reject the application of ${client}?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        customClass: {
          actions: "my-actions",
          cancelButton: "order-1 right-gap",
          confirmButton: "order-2",
          denyButton: "order-3",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateDoc(userdoc, {
            status: "Rejected",
          });
          await updateDoc(admindoc, {
            status: "Rejected",
            rejected_by: username,
            rejected_at: new Date(),
            current_location: "User - Rejected by the admins",
          });
          Swal.fire(`The Application of ${client} was rejected`, "", "success");
        }
      });
    } else {
      Swal.fire({
        title: "Mark as evaluated?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        customClass: {
          actions: "my-actions",
          cancelButton: "order-1 right-gap",
          confirmButton: "order-2",
          denyButton: "order-3",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateDoc(userdoc, {
            status: "Evaluated",
          });
          await updateDoc(admindoc, {
            status: "Evaluated",
            evaluated_by: username,
            evaluated_at: new Date(),
            current_location: "RPS CHIEF - Waiting for Recommending Approval",
          });
          Swal.fire(
            `The Application of ${client} was marked as evaluated`,
            "",
            "success"
          );
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getpendingpermits(permittype, requirementsdiv) {
  const options = { month: "long", day: "numeric", year: "numeric" };

  try {
    const tpcollectionref = collection(db, `${permittype}`);
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
            row.setAttribute(`${permittype}-num`, doc.id);
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
            console.log(docdata.uploadedAt);

            // Add event listener for modal
            row.addEventListener("click", () => {
              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                // Instead of creating a new div, grab the existing one
                const actionButtonsDiv =
                  document.querySelector(".action-buttons");

                // Clear previous content (in case it's already populated)
                actionButtonsDiv.innerHTML = "";

                // Create the first button: "Mark as Evaluated"
                const approveBtn = document.createElement("button");
                approveBtn.id = "approvebtn";
                approveBtn.textContent = "Mark as Evaluated";
                approveBtn.onclick = function () {
                  console.log("Marked as Evaluated");
                  toggleapplication(
                    doc.id,
                    docdata.userID,
                    "approve",
                    `${permittype}`,
                    docdata.client
                  );
                };

                // Create the span wrapper for the second button
                const rejectSpan = document.createElement("span");

                // Create the second button: "Reject"
                const rejectBtn = document.createElement("button");
                rejectBtn.id = "rejectbtn";
                rejectBtn.textContent = "Reject";
                rejectBtn.onclick = function () {
                  console.log("Rejected");
                  toggleapplication(
                    doc.id,
                    docdata.userID,
                    "reject",
                    `${permittype}`,
                    docdata.client
                  );
                };

                // Append the "Reject" button to the span
                rejectSpan.appendChild(rejectBtn);

                // Append both buttons to the main div
                actionButtonsDiv.appendChild(approveBtn);
                actionButtonsDiv.appendChild(rejectSpan);
              });

              document.getElementById("modalClient").textContent =
                docdata.client;
              document.getElementById("modalAddress").textContent =
                docdata.address;
              document.getElementById("modalTitle").textContent = doc.id;
              document.getElementById("modalDate").textContent =
                docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);

              document.getElementById("permitModal").classList.remove("hidden");
            });

            // approvebtn.addEventListener('click', toggleapplication);
            permittablebody.appendChild(row);
          }
        });
        const allPendingRows = Array.from(
          permittablebody.querySelectorAll("tr")
        );
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getpendingpermits_chainsawreg(
  permittype,
  requirementsdiv,
  type
) {
  const options = { month: "long", day: "numeric", year: "numeric" };

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      permittablebody.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          const row = document.createElement("tr");
          if (docdata.status === "Pending" && docdata.type === `${type}`) {
            row.setAttribute(`${permittype}-num`, doc.id);
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
              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                // Instead of creating a new div, grab the existing one
                const actionButtonsDiv =
                  document.querySelector(".action-buttons");

                // Clear previous content (in case it's already populated)
                actionButtonsDiv.innerHTML = "";

                // Create the first button: "Mark as Evaluated"
                const approveBtn = document.createElement("button");
                approveBtn.id = "approvebtn";
                approveBtn.textContent = "Mark as Evaluated";
                approveBtn.onclick = function () {
                  console.log("Marked as Evaluated");
                  toggleapplication(
                    doc.id,
                    docdata.userID,
                    "approve",
                    `${permittype}`,
                    docdata.client
                  );
                };

                // Create the span wrapper for the second button
                const rejectSpan = document.createElement("span");

                // Create the second button: "Reject"
                const rejectBtn = document.createElement("button");
                rejectBtn.id = "rejectbtn";
                rejectBtn.textContent = "Reject";
                rejectBtn.onclick = function () {
                  console.log("Rejected");
                  toggleapplication(
                    doc.id,
                    docdata.userID,
                    "reject",
                    `${permittype}`,
                    docdata.client
                  );
                };

                // Append the "Reject" button to the span
                rejectSpan.appendChild(rejectBtn);

                // Append both buttons to the main div
                actionButtonsDiv.appendChild(approveBtn);
                actionButtonsDiv.appendChild(rejectSpan);
              });

              document.getElementById("modalClient").textContent =
                docdata.client;
              document.getElementById("modalAddress").textContent =
                docdata.address;
              document.getElementById("modalTitle").textContent = doc.id;
              document.getElementById("modalDate").textContent =
                docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);

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

export async function getevaluatedpermits(permittype, tablebodyid, requirementsdiv) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log('getting evaluated dataa');
  
  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      tablebodyid.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          const row = document.createElement("tr");
          if (docdata.status === "Evaluated") {
            row.setAttribute(`${permittype}-num`, doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>Transport Permit</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.evaluated_by}</td>
              <td>${docdata.evaluated_at
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;
            console.log(docdata.uploadedAt);

            // Add event listener for modal
            row.addEventListener("click", () => {
              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                // Instead of creating a new div, grab the existing one
                const actionButtonsDiv =
                  document.querySelector(".action-buttons");

                // Clear previous content (in case it's already populated)
                actionButtonsDiv.innerHTML = "";

                // Create the first button: "Mark as Evaluated"
                const createOOPBtn = document.createElement("button");
                createOOPBtn.id = "createOOPBtn";
                createOOPBtn.textContent = "Create Order of Payment";
                createOOPBtn.onclick = function () {
                  console.log("Creating order of payment...");
                  window.open(`/orderofpayment/${docdata.client}`)
                };

                document.getElementById("modalClient").textContent =
                  docdata.client;
                document.getElementById("modalAddress").textContent =
                  docdata.address;
                document.getElementById("modalTitle").textContent = doc.id;
                document.getElementById("modalDate").textContent =
                  docdata.uploadedAt
                    .toDate()
                    .toLocaleDateString("en-US", options);

                document
                  .getElementById("permitModal")
                  .classList.remove("hidden");

                // Append the "Reject" button to the span

                // Append both buttons to the main div
                actionButtonsDiv.appendChild(createOOPBtn);
              });
            });

            // approvebtn.addEventListener('click', toggleapplication);
            tablebodyid.appendChild(row);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}



export async function getrejectedpermits(permittype, tablebodyid, requirementsdiv) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log('getting REJECTED dataa');
  
  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      tablebodyid.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          const row = document.createElement("tr");
          if (docdata.status === "Rejected") {
            row.setAttribute(`${permittype}-num`, doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>Transport Permit</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.rejected_by}</td>
              <td>${docdata.rejected_at
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;
            console.log(docdata.uploadedAt);

            // Add event listener for modal
            row.addEventListener("click", () => {
              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                // Instead of creating a new div, grab the existing one
                const actionButtonsDiv =
                  document.querySelector(".action-buttons");

                // Clear previous content (in case it's already populated)
                actionButtonsDiv.innerHTML = "";

                // Create the first button: "Mark as Evaluated"
                const createOOPBtn = document.createElement("button");
                createOOPBtn.id = "createOOPBtn";
                createOOPBtn.textContent = "Create Order of Payment";
                createOOPBtn.onclick = function () {
                  console.log("Creating order of payment...");
                  window.open(`/orderofpayment/${docdata.client}`)
                };

                document.getElementById("modalClient").textContent =
                  docdata.client;
                document.getElementById("modalAddress").textContent =
                  docdata.address;
                document.getElementById("modalTitle").textContent = doc.id;
                document.getElementById("modalDate").textContent =
                  docdata.uploadedAt
                    .toDate()
                    .toLocaleDateString("en-US", options);

                document
                  .getElementById("permitModal")
                  .classList.remove("hidden");

                // Append the "Reject" button to the span

                // Append both buttons to the main div
                actionButtonsDiv.appendChild(createOOPBtn);
              });
            });

            // approvebtn.addEventListener('click', toggleapplication);
            tablebodyid.appendChild(row);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}