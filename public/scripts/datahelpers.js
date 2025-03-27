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
import { initMap } from "./maphelper.js";

let allRows = [];
let username = "No user";
const options = { month: "long", day: "numeric", year: "numeric" };

export function searching(searchfilter) {
  const query = searchfilter.value.toLowerCase();

  allRows.forEach((row) => {
    const rowContent = row.rowContent.toLowerCase();
    if (rowContent.includes(query)) {
      row.style.display = ""; // show the row
    } else {
      row.style.display = "none"; // hide the row
    }
  });
}

export function setPermitRows(rowsArray) {
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

export async function getpendingpermits(permittype, requirementsdiv) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  let type = "";
  const modal = document.getElementById("permitModal");

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
            if (permittype === "wildlife") {
              type = "Wildlife Registration";
            } else if (permittype === "plantation") {
              type = "Private Tree Plantation Registration";
            } else {
              type = "Transport Permit";
            }
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>${type}</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            console.log(docdata.uploadedAt);

            row.addEventListener("click", () => {
              modal.setAttribute(`permit-id`, `${doc.id}`);
              modal.setAttribute("user-id", docdata.userID);
              modal.setAttribute("client", docdata.client);
              modal.setAttribute("permittype", permittype);
              modal.setAttribute("permit-status", docdata.status);
              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              );

              document.getElementById("modalClient").value = docdata.client;
              document.getElementById("modalAddress").value = docdata.address;
              document.getElementById("modalTitle").textContent = doc.id;
              document.getElementById("modalDate").value = docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options);

              document.getElementById("permitModal").classList.remove("hidden");
            });

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

export async function getevaluatedpermits(
  permittype,
  tablebodyid,
  requirementsdiv
) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log("getting evaluated dataa");
  let type = "";
  const modal = document.getElementById("permitModal");

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
            if (permittype === "wildlife") {
              type = "Wildlife Registration";
            } else if (permittype === "plantation") {
              type = "Private Tree Plantation Registration";
            } else {
              type = "Transport Permit";
            }
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>${type}</td>
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
              modal.setAttribute(`permit-id`, `${doc.id}`);
              modal.setAttribute("user-id", docdata.userID);
              modal.setAttribute("client", docdata.client);
              modal.setAttribute("permittype", permittype);
              modal.setAttribute("permit-status", docdata.status);

              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                document.getElementById("modalClient").value = docdata.client;
                document.getElementById("modalAddress").value = docdata.address;
                document.getElementById("modalTitle").textContent = doc.id;
                document.getElementById("modalDate").value = docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);

                document
                  .getElementById("permitModal")
                  .classList.remove("hidden");
              });
            });

            tablebodyid.appendChild(row);
          }
        });
        const allPendingRows = Array.from(tablebodyid.querySelectorAll("tr"));
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getrejectedpermits(
  permittype,
  tablebodyid,
  requirementsdiv
) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log("getting REJECTED dataa");
  let type = "";
  const modal = document.getElementById("permitModal");

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
            if (permittype === "wildlife") {
              type = "Wildlife Registration";
            } else if (permittype === "plantation") {
              type = "Private Tree Plantation Registration";
            } else {
              type = "Transport Permit";
            }
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>${type}</td>
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
              modal.setAttribute(`permit-id`, `${doc.id}`);
              modal.setAttribute("user-id", docdata.userID);
              modal.setAttribute("client", docdata.client);
              modal.setAttribute("permittype", permittype);
              modal.setAttribute("permit-status", docdata.status);

              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                document.getElementById("modalClient").value = docdata.client;
                document.getElementById("modalAddress").value = docdata.address;
                document.getElementById("modalTitle").textContent = doc.id;
                document.getElementById("modalDate").value = docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);

                document
                  .getElementById("permitModal")
                  .classList.remove("hidden");
              });
            });

            tablebodyid.appendChild(row);
          }
        });

        const allPendingRows = Array.from(tablebodyid.querySelectorAll("tr"));
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getpendingpermits_chainsawandtcp(
  permittype,
  requirementsdiv,
  type
) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  const modal = document.getElementById("permitModal");
  const datadisplayerdiv = document.getElementById("data-displayer");
  const requirementsdisplayerdiv = document.getElementById(
    "requirements-displayer"
  );

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
              <td>${docdata.type}</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            // Add event listener for modal
            row.addEventListener("click", () => {
              initMap(`${docdata.location._lat}`, `${docdata.location._long}`);
              if (permittype === "tree_cutting") {
                datadisplayerdiv.style.display = "";
                requirementsdisplayerdiv.style.display = "none";
              }
              modal.setAttribute(`permit-id`, `${doc.id}`);
              modal.setAttribute("user-id", docdata.userID);
              modal.setAttribute("client", docdata.client);
              modal.setAttribute("permittype", permittype);
              modal.setAttribute("permit-status", docdata.status);
              modal.setAttribute(
                "tcp-location-lat",
                `${docdata.location._lat}`
              );
              modal.setAttribute(
                "tcp-location-long",
                `${docdata.location._long}`
              );
              console.log(docdata.location);

              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              );

              document.getElementById("modalClient").value = docdata.client;
              document.getElementById("modalAddress").value = docdata.address;
              document.getElementById("modalTitle").textContent = doc.id;
              document.getElementById("modalDate").value = docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options);

              document.getElementById("permitModal").classList.remove("hidden");
            });

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

export async function getevaluatedpermits_chainsawandtcp(
  permittype,
  requirementsdiv,
  tablebodyid,
  type
) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  const modal = document.getElementById("permitModal");
  const datadisplayerdiv = document.getElementById("data-displayer");
  const requirementsdisplayerdiv = document.getElementById(
    "requirements-displayer"
  );

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
          if (docdata.status === "Evaluated" && docdata.type === `${type}`) {
            row.setAttribute(`${permittype}-num`, doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>${docdata.type}</td>
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

            // Add event listener for modal
            row.addEventListener("click", () => {
              initMap(`${docdata.location._lat}`, `${docdata.location._long}`);
              if (permittype === "tree_cutting") {
                datadisplayerdiv.style.display = "";
                requirementsdisplayerdiv.style.display = "none";
              }
              modal.setAttribute(`permit-id`, `${doc.id}`);
              modal.setAttribute("user-id", docdata.userID);
              modal.setAttribute("client", docdata.client);
              modal.setAttribute("permittype", permittype);
              modal.setAttribute("permit-status", docdata.status);
              modal.setAttribute(
                "tcp-location-lat",
                `${docdata.location._lat}`
              );
              modal.setAttribute(
                "tcp-location-long",
                `${docdata.location._long}`
              );
              console.log(docdata.location);

              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                document.getElementById("modalClient").value = docdata.client;
                document.getElementById("modalAddress").value = docdata.address;
                document.getElementById("modalTitle").textContent = doc.id;
                document.getElementById("modalDate").value = docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);

                document
                  .getElementById("permitModal")
                  .classList.remove("hidden");
              });
            });

            tablebodyid.appendChild(row);
          }
        });
        const allPendingRows = Array.from(tablebodyid.querySelectorAll("tr"));
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getrejectedpermits_chainsawandtcp(
  permittype,
  requirementsdiv,
  tablebodyid,
  type
) {
  const modal = document.getElementById("permitModal");
  const datadisplayerdiv = document.getElementById("data-displayer");
  const requirementsdisplayerdiv = document.getElementById(
    "requirements-displayer"
  );

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
          if (docdata.status === "Rejected" && docdata.type === `${type}`) {
            row.setAttribute(`${permittype}-num`, doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td>${docdata.type}</td>
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

            // Add event listener for modal
            row.addEventListener("click", () => {
              if (permittype === "tree_cutting") {
                datadisplayerdiv.style.display = "";
                requirementsdisplayerdiv.style.display = "none";
              }
              modal.setAttribute(`permit-id`, `${doc.id}`);
              modal.setAttribute("user-id", docdata.userID);
              modal.setAttribute("client", docdata.client);
              modal.setAttribute("permittype", permittype);
              modal.setAttribute("permit-status", docdata.status);
              // modal.setAttribute(
              //   "tcp-location-lat",
              //   `${docdata.location._lat}`
              // );
              // modal.setAttribute(
              //   "tcp-location-long",
              //   `${docdata.location._long}`
              // );
              console.log(docdata.location);
              getfiles(
                `${doc.id.toString()}`,
                requirementsdiv,
                `${permittype}`
              ).then((sample) => {
                document.getElementById("modalClient").value = docdata.client;
                document.getElementById("modalAddress").value = docdata.address;
                document.getElementById("modalTitle").textContent = doc.id;
                document.getElementById("modalDate").value = docdata.uploadedAt
                  .toDate()
                  .toLocaleDateString("en-US", options);

                document
                  .getElementById("permitModal")
                  .classList.remove("hidden");
              });
            });

            tablebodyid.appendChild(row);
          }
        });
        const allPendingRows = Array.from(tablebodyid.querySelectorAll("tr"));
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updatetreecuttingdetails(tcpdoc, data) {
  console.log(tcpdoc.data);
  try {
    await updateDoc(tcpdoc, data).then((ctrl) => {
      console.log("Document Updated");
    });
  } catch (error) {
    console.error(error);
  }
}
