import { db, auth } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

let allRowspending = [];
//configure searching for flexible api calls
let allRowseval = [];
let allRowsrejected = [];
let username = "No user";

import { options } from "./constants/dateconstants.js";

import {
  permittablebody,
  evaluatedtablebody,
  rejectedtablebody,
} from "./constants/tableconstants.js";

export function searching(searchfilter) {
  const query = searchfilter.value.toLowerCase();

  allRowspending.forEach((row) => {
    const rowContent = row.textContent.toLowerCase();
    if (rowContent.includes(query)) {
      row.style.display = ""; // show the row
    } else {
      row.style.display = "none"; // hide the row
    }
  });
}

export function setPermitRows(rowsArray) {
  allRowspending = rowsArray;
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

export async function markasinitialized(permitid, permittype, client) {
  const admindoc = doc(db, `${permittype}`, permitid);
  // const userdoc = doc(db, `mobile_users/${userid}/applications`, permitid);

  try {
    Swal.fire({
      title: "Mark as initialized?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(admindoc, {
          status: "Initialized by RPS Chief",
          evaluated_by: username,
          evaluated_at: new Date(),
          current_location: "Pending CENRO Approval",
        });
        Swal.fire(
          `The Application of ${client} was initialized`,
          "",
          "success"
        );
      }
    });
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
  } else {
    console.log("Nobody is logged in");
  }
});

export async function getpendingpermits(permittype) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  let type = "";

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
          const evaluatebtn = document.createElement("button");
          evaluatebtn.innerHTML = "Evaluate";
          evaluatebtn.id = "e-btn";
          evaluatebtn.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          evaluatebtn.addEventListener("mouseenter", () => {
            evaluatebtn.style.backgroundColor = "rgb(162, 212, 162)";
            evaluatebtn.style.color = "black";
          });

          evaluatebtn.addEventListener("mouseleave", () => {
            evaluatebtn.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
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
            const td = document.createElement("td");
            td.appendChild(evaluatebtn);
            row.appendChild(td);

            evaluatebtn.addEventListener("click", () => {
              window.open(
                `/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/evaluation`
              );
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

export async function getevaluatedpermits(permittype) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log("getting evaluated dataa");
  let type = "";

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      evaluatedtablebody.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          const row = document.createElement("tr");
          const viewbtn = document.createElement("button");
          viewbtn.innerHTML = "View";
          viewbtn.id = "e-btn";
          viewbtn.style =
            "color: white; background-color: blue; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          viewbtn.addEventListener("mouseenter", () => {
            viewbtn.style.backgroundColor = "rgb(162, 212, 162)";
            viewbtn.style.color = "black";
          });

          viewbtn.addEventListener("mouseleave", () => {
            viewbtn.style =
              "color: white; background-color: blue; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          if (
            docdata.status === "Evaluated" ||
            docdata.status === "Initialized by RPS Chief"
          ) {
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

            viewbtn.addEventListener("click", () => {
              window.open(
                `/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });
            const td = document.createElement("td");
            td.appendChild(viewbtn);
            row.appendChild(td);

            evaluatedtablebody.appendChild(row);
          }
        });
        const allPendingRows = Array.from(
          evaluatedtablebody.querySelectorAll("tr")
        );
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getrejectedpermits(permittype) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log("getting REJECTED dataa");
  let type = "";

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      rejectedtablebody.innerHTML = "";
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

            rejectedtablebody.appendChild(row);
          }
        });

        const allPendingRows = Array.from(
          rejectedtablebody.querySelectorAll("tr")
        );
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getpendingpermits_chainsawandtcp(permittype, type) {
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
          const evaluatebtn = document.createElement("button");
          evaluatebtn.innerHTML = "Evaluate";
          evaluatebtn.id = "e-btn";
          evaluatebtn.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          evaluatebtn.addEventListener("mouseenter", () => {
            evaluatebtn.style.backgroundColor = "rgb(162, 212, 162)";
            evaluatebtn.style.color = "black";
          });

          evaluatebtn.addEventListener("mouseleave", () => {
            evaluatebtn.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
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

            const td = document.createElement("td");
            td.appendChild(evaluatebtn);
            row.appendChild(td);

            evaluatebtn.addEventListener("click", () => {
              // console.log(`${doc.id}`);
              window.open(
                `/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/evaluation`
              );
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

export async function getevaluatedpermits_chainsawandtcp(permittype, type) {
  const options = { month: "long", day: "numeric", year: "numeric" };

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      evaluatedtablebody.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          const row = document.createElement("tr");
          const viewbtn = document.createElement("button");
          viewbtn.innerHTML = "View";
          viewbtn.id = "e-btn";
          viewbtn.style =
            "color: white; background-color: blue; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          viewbtn.addEventListener("mouseenter", () => {
            viewbtn.style.backgroundColor = "rgb(162, 212, 162)";
            viewbtn.style.color = "black";
          });

          viewbtn.addEventListener("mouseleave", () => {
            viewbtn.style =
              "color: white; background-color: blue; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          if (
            (docdata.status === "Evaluated" && docdata.type === `${type}`) ||
            docdata.status === "Initialized by RPS Chief"
          ) {
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

            viewbtn.addEventListener("click", () => {
              window.open(
                `/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });

            const td = document.createElement("td");
            td.appendChild(viewbtn);
            row.appendChild(td);

            evaluatedtablebody.appendChild(row);
          }
        });
        const allPendingRows = Array.from(
          evaluatedtablebody.querySelectorAll("tr")
        );
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getrejectedpermits_chainsawandtcp(permittype, type) {
  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      rejectedtablebody.innerHTML = "";
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

            rejectedtablebody.appendChild(row);
          }
        });
        const allPendingRows = Array.from(
          rejectedtablebody.querySelectorAll("tr")
        );
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
