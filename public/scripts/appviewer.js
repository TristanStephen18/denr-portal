import { db, auth } from "./config.js";
import {
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initMap } from "./maphelper.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import {
  defaultpfp,
  pfpimage,
  clientaddress,
  clientcontact,
  clientname,
  clientemail,
  clientinitials,
  permitaddresstcp,
  permitaddresstp1,
  permitaddresstp2,
  nooop,
  insertoopdiv,
  submissiondate,
  inspectiondate1,
  inspectiondate2,
  loadingmodal,
} from "./constants/appviewerconstants.js";
import { getfiles, getOOP } from "./decoder.js";
// import { getUsername } from "./datahelpers.js";
import { updateAdminApplication } from "./helpers/appviewer_helpers.js";

let username = "";

let userid = "";
let filebased62encoded = "";

window.onclick = (e) => {
  if (e.target === loadingmodal) loadingmodal.style.display = "none";
};

async function getuserdata(userid) {
  const userdoc = doc(db, "mobile_users", `${userid}`);
  const usersnapshot = await getDoc(userdoc);
  const userdata = usersnapshot.data();
  if (userdata.changed_photo == null) {
    setdefaultpfp(userdata.name);
  } else {
    defaultpfp.style.display = "none";
    pfpimage.style.display = "block";
    pfpimage.src = `data:image/jpeg;base64,${userdata.photo}`;
  }

  console.log(userdata.changed_photo);

  clientaddress.value = `${userdata.address}`;
  clientname.value = `${userdata.name}`;
  clientcontact.value = `${userdata.contact}`;
  clientemail.value = `${userdata.email}`;
}

async function getpermitdata(permitid, permittype) {
  const permitdoc = doc(db, `${permittype}`, `${permitid}`);
  const snapshot = await getDoc(permitdoc);
  const data = snapshot.data();
  userid = data.userID;
  getuserdata(userid);
  if (permittype === "tree_cutting") {
    initMap(
      data.location._lat,
      data.location._long,
      "Tree Cutting",
      "",
      "",
      "",
      ""
    );
    permitaddresstcp.value = `${data.tcp_location}`;
  } else if (permittype === "transport_permit") {
    initMap(
      "",
      "",
      "Transport Permit",
      data.from_coordinates._lat,
      data.from_coordinates._long,
      data.to_coordinates._lat,
      data.to_coordinates._long
    );
    permitaddresstp1.value = `${data.from}`;
    permitaddresstp2.value = `${data.to}`;
    // permitaddress.value = `${data.tcp_location}`;
  }

  if (p === "evaluation") {
    if (data.type === `undefined`) {
      document.getElementById("cna_oopbtn").addEventListener("click", () => {
        window.open(
          `/orderofpayment/${data.client}/${data.address}/${permittype}/`
        );
        nooop.style.display = "none";
        insertoopdiv.style.display = "block";
      });
    } else {
      document.getElementById("cna_oopbtn").addEventListener("click", () => {
        window.open(
          `/orderofpayment/${data.client}/${data.address}/${permittype}/${data.type}`
        );
        nooop.style.display = "none";
        insertoopdiv.style.display = "block";
      });
    }
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in");

    const userdocref = doc(db, "admins", user.uid);
    console.log(userdocref);
    const snapshot = await getDoc(userdocref);
    console.log(snapshot.data().username);
    // return snapshot.data().username;
    username = snapshot.data().username;
  } else {
    console.log("Nobody is logged in");
    // return "nobody is logged in";
    username = "Unknown";
  }
});

function initializepage() {
  getpermitdata(newpermitid, newpermittype);
  getfiles(newpermitid, newpermittype);
  const permitdoc = doc(db, `${newpermittype}`, `${newpermitid}`);
  if (p != "evaluation") {
    getOOP(permitdoc);
  }
}

function setdefaultpfp(cname) {
  cname = cname.toUpperCase();
  const nameseparated = cname.split(" ");
  if (nameseparated.length === 1) {
    clientinitials.innerHTML = `${nameseparated[0].split("")[0]}`;
  } else {
    clientinitials.innerHTML = `${nameseparated[0].split("")[0]}${
      nameseparated[nameseparated.length - 1].split("")[0]
    }`;
  }
}

if (p === "evaluation") {
  document.getElementById("exit_btn").addEventListener("click", () => {
    window.close();
  });
  document
    .getElementById("f_evaluation")
    .addEventListener("click", async () => {
      const file = document.getElementById("oopfile").files[0];

      if (
        file &&
        submissiondate.value !== "" &&
        inspectiondate1.value !== "" &&
        inspectiondate2.value !== ""
      ) {
        const reader = new FileReader();

        reader.onload = function (e) {
          filebased62encoded = e.target.result.split(",")[1]; // cleaner way

          console.log("File loaded in onload");
        };

        reader.readAsDataURL(file);

        // Check every 100ms if filebased62encoded has been set
        const waitForFile = setInterval(() => {
          if (filebased62encoded && filebased62encoded.length > 0) {
            clearInterval(waitForFile);

            const inspectiondates = [
              new Date(inspectiondate1.value),
              new Date(inspectiondate2.value),
            ];

            const userdoc = doc(
              db,
              `mobile_users/${userid}/applications`,
              `${newpermitid}`
            );
            const admindoc = doc(db, `${newpermittype}`, `${newpermitid}`);

            Swal.fire({
              title: "Are you done with the evaluation?",
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
                loadingmodal.style.display = "block";
                await updateAdminApplication(
                  username,
                  admindoc,
                  filebased62encoded,
                  inspectiondates,
                  new Date(submissiondate.value)
                ).then((result) => {
                  console.log("hi");
                });
                loadingmodal.style.display = "none";
              }
            });
          }
        }, 100);
      } else {
        // loadingmodal.style.display = "block";
        Swal.fire(
          `You have not finished you evaluation yet...`,
          "Please fill up all the fields",
          "error"
        );
      }
    });
} else {
  document.getElementById("exit").addEventListener("click", () => {
    window.close();
  });
}

window.onload = initializepage;
