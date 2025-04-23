import { db, auth } from "../helpers/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
let allRowspending = [];
let allRowsevaluated = [];
let allRowsInitialized = [];
let allRowsRecommended = [];
let allRowsReleased = [];
let allRowsApproved = [];
import { options } from "../constants/dateconstants.js";
import {
  permittablebody,
  evaluatedtablebody,
  inspectedtablebody,
  recommendedforapprovaltbody,
  approvedtablebody,
  endorsementmodal,
  choosercontent,
  loadercontent
} from "../constants/tableconstants.js";

// import { togglepermitmodal } from "./togglers.js";

function togglepermitmodal(status){
  if(status === "load"){
    choosercontent.style.display = "none";
    loadercontent.style.display = "";
  }else{
    choosercontent.style.display = "";
    loadercontent.style.display = "none";
  }
}

let adminname = "";
export function setPermitRows(rowsArray) {
  allRowspending = rowsArray;
  $("#pending-table").DataTable();
}

function setEvaluatedPermitRows(rowsArray) {
  allRowsevaluated = rowsArray;
  $("#evaluated-table").DataTable();
}

function setInitializedPermits(rowsArray) {
  allRowsInitialized = rowsArray;
  $("#inspectedtable").DataTable();
}

function setRecommendedPermits(rowsArray) {
  allRowsRecommended = rowsArray;
  $("#recommendedforapprovaltable").DataTable();
}

function setApprovedPermits(rowsArray) {
  allRowsApproved = rowsArray;
  $("#approvedbycenrotable").DataTable();
}

function setEndorsedReleasedPermits(rowsArray) {
  allRowsReleased = rowsArray;
  $("#inspectedtable").DataTable();
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in");

    const userdocref = doc(db, "admins", user.uid);
    console.log(userdocref);
    const snapshot = await getDoc(userdocref);
    console.log(snapshot.data().username);
    // return snapshot.data().username;
    adminname = snapshot.data().username;
  } else {
    console.log("Nobody is logged in");
    // return "nobody is logged in";
    adminname = "Unknown";
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
                `/permit/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/evaluation`
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
    $("#pending-table").DataTable({
      searching: false,
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

          const markasinspectedbtn = document.createElement("button");
          markasinspectedbtn.innerHTML = "Mark as Inspected";
          markasinspectedbtn.id = "mai-btn";
          markasinspectedbtn.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          markasinspectedbtn.addEventListener("mouseenter", () => {
            markasinspectedbtn.style.backgroundColor = "rgb(162, 212, 162)";
            markasinspectedbtn.style.color = "black";
          });

          markasinspectedbtn.addEventListener("mouseleave", () => {
            markasinspectedbtn.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
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
                `/permit/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });

            markasinspectedbtn.addEventListener("click", () => {
              Swal.fire({
                title: "Mark as Inspected?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: "No",
                customClass: {
                  actions: "my-actions",
                  cancelButton: "order-1 right-gap",
                  confirmButton: "order-2",
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  endorsementmodal.style.display = "block";
                  togglepermitmodal("load");
                  axios
                    .get(
                      `/evaluator/markasinspected/${permittype}/${doc.id}/${adminname}/${docdata.userID}`
                    )
                    .then((response) => {
                      if (response.data === 200) {
                        endorsementmodal.style.display = "none";

                        Swal.fire(
                          `Permit data was successfully updated`,
                          "",
                          "success"
                        );
                      } else {
                        Swal.fire(`Error updating permit`, "", "error");
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });
            });
            const td = document.createElement("td");
            td.style = "display: flex; Flex-direction: row; gap: 3px;";
            td.appendChild(viewbtn);
            td.appendChild(markasinspectedbtn);
            row.appendChild(td);

            evaluatedtablebody.appendChild(row);
          }
        });
        const allEvaluatedRows = Array.from(
          evaluatedtablebody.querySelectorAll("tr")
        );
        setEvaluatedPermitRows(allEvaluatedRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getInspectedPermits(permittype) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  console.log("getting REJECTED dataa");
  let type = "";

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      inspectedtablebody.innerHTML = "";
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

          const markasrecommended = document.createElement("button");
          markasrecommended.innerHTML = "Recommend for Approval";
          markasrecommended.id = "mai-btn";
          markasrecommended.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          markasrecommended.addEventListener("mouseenter", () => {
            markasrecommended.style.backgroundColor = "rgb(162, 212, 162)";
            markasrecommended.style.color = "black";
          });

          markasrecommended.addEventListener("mouseleave", () => {
            markasrecommended.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          if (docdata.status === "Inspected") {
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
              <td><span class="status">${docdata.status}</span></td>
              <td>${
                docdata.updated_by === "undefined"
                  ? "Default"
                  : docdata.updated_by
              }</td>
              <td>${docdata.inspected_at
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            viewbtn.addEventListener("click", () => {
              window.open(
                `/permit/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });

            markasrecommended.addEventListener("click", () => {
              Swal.fire({
                title: "Recommend for Approval?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: "No",
                customClass: {
                  actions: "my-actions",
                  cancelButton: "order-1 right-gap",
                  confirmButton: "order-2",
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  endorsementmodal.style.display = "block";
                  togglepermitmodal('load');
                  axios
                    .get(
                      `/evaluator/recommendforapproval/${permittype}/${doc.id}/${adminname}/${docdata.userID}`
                    )
                    .then((response) => {
                      if (response.data === 200) {
                        endorsementmodal.style.display = "none";

                        Swal.fire(
                          `Permit data was successfully updated`,
                          "Application/Permit was Recommended for Approval",
                          "success"
                        );
                      } else {
                        Swal.fire(`Error updating permit`, "", "error");
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });
            });
            console.log(docdata.uploadedAt);
            const td = document.createElement("td");
            td.style = "display: flex; Flex-direction: row; gap: 3px;";
            td.appendChild(viewbtn);
            td.appendChild(markasrecommended);
            row.appendChild(td);

            inspectedtablebody.appendChild(row);
          }
        });

        const allPendingRows = Array.from(
          inspectedtablebody.querySelectorAll("tr")
        );
        setInitializedPermits(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getRecommendedPermits(permittype) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  let type = "";

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      recommendedforapprovaltbody.innerHTML = "";
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

          const markasapprovedbycenro = document.createElement("button");
          markasapprovedbycenro.innerHTML = "Mark as Approved";
          markasapprovedbycenro.id = "mai-btn";
          markasapprovedbycenro.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          markasapprovedbycenro.addEventListener("mouseenter", () => {
            markasapprovedbycenro.style.backgroundColor = "rgb(162, 212, 162)";
            markasapprovedbycenro.style.color = "black";
          });

          markasapprovedbycenro.addEventListener("mouseleave", () => {
            markasapprovedbycenro.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          if (docdata.status === "Recommended for Approval") {
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
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.current_location}</td>
              <td>${docdata.updated_at
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
              <td>${
                docdata.updated_by === "undefined"
                  ? "Default"
                  : docdata.updated_by
              }</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            viewbtn.addEventListener("click", () => {
              window.open(
                `/permit/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });

            markasapprovedbycenro.addEventListener("click", () => {
              Swal.fire({
                title: "Mark as Approved by CENRO?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: "No",
                customClass: {
                  actions: "my-actions",
                  cancelButton: "order-1 right-gap",
                  confirmButton: "order-2",
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  endorsementmodal.style.display = "block";
                  // togglepermitmodal('load')
                  togglepermitmodal('load');
                  axios
                    .get(
                      `/evaluator/approvepermit/${permittype}/${doc.id}/${adminname}/${docdata.userID}`
                    )
                    .then((response) => {
                      if (response.data === 200) {
                        endorsementmodal.style.display = "none";

                        Swal.fire(
                          `Permit data was successfully updated`,
                          "Application/Permit was marked as approved by CENRO",
                          "success"
                        );
                      } else {
                        Swal.fire(`Error updating permit`, "", "error");
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });
            });
            console.log(docdata.uploadedAt);
            const td = document.createElement("td");
            td.style = "display: flex; Flex-direction: row; gap: 3px;";
            td.appendChild(viewbtn);
            td.appendChild(markasapprovedbycenro);
            row.appendChild(td);

            recommendedforapprovaltbody.appendChild(row);
          }
        });

        const allPendingRows = Array.from(
          inspectedtablebody.querySelectorAll("tr")
        );
        setRecommendedPermits(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getApprovedPermits(permittype) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  let type = "";

  try {
    const tpcollectionref = collection(db, `${permittype}`);
    onSnapshot(tpcollectionref, (snapshot) => {
      approvedtablebody.innerHTML = "";
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

          const showactionsbtn = document.createElement("button");
          showactionsbtn.innerHTML = "Endorse";
          showactionsbtn.id = "mai-btn";
          showactionsbtn.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          showactionsbtn.addEventListener("mouseenter", () => {
            showactionsbtn.style.backgroundColor = "rgb(162, 212, 162)";
            showactionsbtn.style.color = "black";
          });

          showactionsbtn.addEventListener("mouseleave", () => {
            showactionsbtn.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          if (docdata.status === "Approved by CENRO for Release/Endorsement") {
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
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
                <td>${
                docdata.updated_by === "undefined"
                  ? "Default"
                  : docdata.updated_by
              }</td>
              <td>${docdata.updated_at
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            viewbtn.addEventListener("click", () => {
              window.open(
                `/permit/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });

            showactionsbtn.addEventListener('click', ()=>{
              endorsementmodal.style.display = "block";
            })

            console.log(docdata.uploadedAt);
            const td = document.createElement("td");
            td.style = "display: flex; Flex-direction: row; gap: 3px;";
            td.appendChild(viewbtn);
            td.appendChild(showactionsbtn);
            row.appendChild(td);

            approvedtablebody.appendChild(row);
          }
        });

        const allPendingRows = Array.from(
          inspectedtablebody.querySelectorAll("tr")
        );
        setApprovedPermits(allPendingRows);
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
      let pendingpermits = [];
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          if (docdata.status === "Pending" && docdata.type === `${type}`) {
            pendingpermits.push({ id: doc.id, data: docdata });
          }
        });

        pendingpermits.sort(
          (a, b) => b.data.uploadedAt.toDate() - a.data.uploadedAt.toDate()
        );

        pendingpermits.forEach(({ id, data }) => {
          // const data = doc.data();
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
          if (data.status === "Pending" && data.type === `${type}`) {
            row.setAttribute(`${permittype}-num`, id);
            row.innerHTML = `
              <td>${data.client}</td>
              <td>${id}</td>
              <td><span class="status">${data.status}</span></td>
              <td>${data.current_location}</td>
              <td>${data.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            const td = document.createElement("td");
            td.appendChild(evaluatebtn);
            row.appendChild(td);

            evaluatebtn.addEventListener("click", () => {
              // console.log(`${doc.id}`);
              window.open(
                `/permit/application/${data.client}/${id}/${data.type}/${permittype}/evaluation`
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
      const docsArray = [];
      evaluatedtablebody.innerHTML = "";
      console.log(snapshot);
      if (snapshot.empty) {
        console.log("Snapshot is empty");
      } else {
        snapshot.forEach((doc) => {
          const docdata = doc.data();
          if (docdata.status === "Evaluated" && docdata.type === `${type}`) {
            docsArray.push({ id: doc.id, data: docdata });
          }
        });

        docsArray.sort(
          (a, b) => b.data.evaluated_at.toDate() - a.data.evaluated_at.toDate()
        );

        docsArray.forEach(({ id, data }) => {
          const row = document.createElement("tr");
          row.setAttribute(`${permittype}-num`, id);
          row.innerHTML = `
            <td>${data.client}</td>
            <td>${id}</td>
            <td><span class="status">${data.status}</span></td>
            <td>${data.evaluated_by}</td>
            <td>${data.evaluated_at
              .toDate()
              .toLocaleDateString("en-US", options)}</td>
            <td>${data.current_location}</td>
            <td>${data.uploadedAt
              .toDate()
              .toLocaleDateString("en-US", options)}</td>
          `;

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
          viewbtn.addEventListener("click", () => {
            window.open(
              `/permit/application/${data.client}/${id}/${data.type}/${permittype}/view`
            );
          });

          const markasinspectedbtn = document.createElement("button");
          markasinspectedbtn.innerHTML = "Mark as Inspected";
          markasinspectedbtn.id = "mai-btn";
          markasinspectedbtn.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          markasinspectedbtn.addEventListener("mouseenter", () => {
            markasinspectedbtn.style.backgroundColor = "rgb(162, 212, 162)";
            markasinspectedbtn.style.color = "black";
          });
          markasinspectedbtn.addEventListener("mouseleave", () => {
            markasinspectedbtn.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          markasinspectedbtn.addEventListener("click", () => {
            Swal.fire({
              title: "Mark as Inspected?",
              showCancelButton: true,
              confirmButtonText: "Yes",
              denyButtonText: "No",
              customClass: {
                actions: "my-actions",
                cancelButton: "order-1 right-gap",
                confirmButton: "order-2",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                getUserToken("sample");
                axios
                  .get(
                    `/evaluator/markasinspected/${permittype}/${id}/${adminname}/${data.userID}`
                  )
                  .then((response) => {
                    if (response.data === 200) {
                      Swal.fire(
                        `Permit data was successfully updated`,
                        "",
                        "success"
                      );
                    } else {
                      Swal.fire(`Error updating permit`, "", "error");
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            });
          });

          const td = document.createElement("td");
          td.style = "display: flex; flex-direction: row; gap: 3px;";
          td.appendChild(viewbtn);
          td.appendChild(markasinspectedbtn);
          row.appendChild(td);

          evaluatedtablebody.appendChild(row);
        });

        const allPendingRows = Array.from(
          evaluatedtablebody.querySelectorAll("tr")
        );
        setEvaluatedPermitRows(allPendingRows);
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
      inspectedtablebody.innerHTML = "";
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

          const markasrecommended = document.createElement("button");
          markasrecommended.innerHTML = "Recommend for Approval";
          markasrecommended.id = "mai-btn";
          markasrecommended.style =
            "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          markasrecommended.addEventListener("mouseenter", () => {
            markasrecommended.style.backgroundColor = "rgb(162, 212, 162)";
            markasrecommended.style.color = "black";
          });

          markasrecommended.addEventListener("mouseleave", () => {
            markasrecommended.style =
              "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
          });
          if (docdata.status === "Inspected" && docdata.type === `${type}`) {
            row.setAttribute(`${permittype}-num`, doc.id);
            row.innerHTML = `
              <td>${docdata.client}</td>
              <td>${doc.id}</td>
              <td><span class="status">${docdata.status}</span></td>
              <td>${docdata.updated_by}</td>
              <td>${docdata.inspected_at
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
              <td>${docdata.current_location}</td>
              <td>${docdata.uploadedAt
                .toDate()
                .toLocaleDateString("en-US", options)}</td>
            `;

            viewbtn.addEventListener("click", () => {
              window.open(
                `/permit/application/${docdata.client}/${doc.id}/${docdata.type}/${permittype}/view`
              );
            });

            markasrecommended.addEventListener("click", () => {
              Swal.fire({
                title: "Recommend for Approval?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: "No",
                customClass: {
                  actions: "my-actions",
                  cancelButton: "order-1 right-gap",
                  confirmButton: "order-2",
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  // axios
                  //   .get(
                  //     `/evaluator/markasinspected/${permittype}/${doc.id}/${adminname}/${docdata.userID}`
                  //   )
                  //   .then((response) => {
                  //     if (response.data === 200) {
                  //       Swal.fire(
                  //         `Permit data was successfully updated`,
                  //         "",
                  //         "success"
                  //       );
                  //     } else {
                  //       Swal.fire(`Error updating permit`, "", "error");
                  //     }
                  //   })
                  //   .catch((error) => {
                  //     console.log(error);
                  //   });
                }
              });
            });

            console.log(docdata.uploadedAt);
            const td = document.createElement("td");
            td.style = "display: flex; Flex-direction: row; gap: 3px;";
            td.appendChild(viewbtn);
            td.appendChild(markasrecommended);
            row.appendChild(td);

            inspectedtablebody.appendChild(row);
          }
        });
        const allPendingRows = Array.from(
          inspectedtablebody.querySelectorAll("tr")
        );
        setInitializedPermits(allPendingRows);
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

function getUserToken(userid) {
  console.log("Hello world");
}
