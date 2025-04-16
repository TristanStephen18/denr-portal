import { db } from "./config.js";
import {
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initMap } from "./maphelper.js";

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
} from "./constants/appviewerconstants.js";
import { getfiles } from "./decoder.js";

let userid = "";
let filebased62encoded = "";

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

function initializepage() {
  getpermitdata(newpermitid, newpermittype);
  getfiles(newpermitid, newpermittype);
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

let holder = "";

if (p === "evaluation") {
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
          filebased62encoded = e.target.result.replace(
            "data:application/pdf;base64,",
            ""
          );
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

            updateApplication(
              userid,
              newpermitid,
              newpermittype,
              userdoc,
              filebased62encoded
            );
            updateApplication(
              userid,
              newpermitid,
              newpermittype,
              admindoc,
              filebased62encoded
            );
          }
        }, 100);
      } else {
        console.log("Missing input");
      }
    });
} else {
  document.getElementById("exit").addEventListener("click", () => {
    window.close();
  });
}

async function updateApplication(userid, permit_id, permit_type, doctoupdate) {
  try {
    console.log(filebased62encoded);

    console.log(userid, permit_type, permit_id, doctoupdate);
    await updateDoc(doctoupdate, {
      'inspection_dates': [new Date(), new Date("2025-04-01")],
      'oop': `${filebased62encoded}`,
      'submission_date': new Date(),
      'status': "Evaluated",
    });
  } catch (error) {
    console.error(error);
  }
}

window.onload = initializepage;

