import { db } from "./config.js";
import {
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
} from "./constants/appviewerconstants.js";
import { getfiles } from "./decoder.js";

let userid = "";

async function getuserdata(userid) {
  const userdoc = doc(db, "mobile_users", `${userid}`);
  const usersnapshot = await getDoc(userdoc);
  const userdata = usersnapshot.data();
  if (userdata.change_photo == null) {
    setdefaultpfp(userdata.name);
  } else {
    defaultpfp.style.display = "none";
    pfpimage.style.display = "block";
    pfpimage.src = `data:image/jpeg;base64,${userdata.photo}`;
  }

  console.log(userdata.change_photo);

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

window.onload = initializepage;

// alert(newpermittype)
