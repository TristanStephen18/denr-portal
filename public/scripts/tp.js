import { logoutfunction } from "./config.js";
import {
  getpendingpermits,
  searching,
  getevaluatedpermits,
  getrejectedpermits,
  toggleapplication,
} from "./datahelpers.js";

import { modalcontenttoggler } from "./helpers/togglers.js";
// import { createOOPbtn, permitmodal, approverbtn, rejectbtn } from "./tcp_public.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

// const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const permitmodal = document.getElementById("permitModal");
const searchfilter = document.getElementById("searchdata");
const requirementsdiv = document.getElementById("requirements");
const statusfilter = document.getElementById("status");
const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("rejected-table");
const rejectedtablebody = document.getElementById("rejectedtbody");
const typelabel = document.getElementById("typelabel");


const pendingtable = document.getElementById("pending-table");
const viewreqsbutton = document.getElementById("viewrequirementsbtn");
const approverbtn = document.getElementById("approvebtn");
const rejectbtn = document.getElementById("rejectbtn");
const createOOPbtn = document.getElementById("createOOPbtn");
const backbtn = document.getElementById("backbtn");
const tablechanger = {
  pending: pendingtable,
  evaluated: evaluatedtable,
  rejected: rejectedtable,
};

searchfilter.addEventListener("input", () => {
  searching(searchfilter);
});

createOOPbtn.addEventListener("click", () => {
  window.open(
    `/orderofpayment/${permitmodal.getAttribute(
      "client"
    )}/${permitmodal.getAttribute("permit-address")}/${permitmodal.getAttribute(
      "permittype"
    )}/null`
  );
});

approverbtn.addEventListener("click", () => {
  toggleapplication(
    permitmodal.getAttribute("permit-id"),
    permitmodal.getAttribute("user-id"),
    "Approved",
    permitmodal.getAttribute("permittype"),
    permitmodal.getAttribute("client")
  );
});

rejectbtn.addEventListener("click", () => {
  toggleapplication(
    permitmodal.getAttribute("permit-id"),
    permitmodal.getAttribute("user-id"),
    "reject",
    permitmodal.getAttribute("permittype"),
    permitmodal.getAttribute("client")
  );
});

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  searchfilter.value = "";
  if (statusfilter.value === "pending") {
    typelabel.innerText = "Pending";
    getpendingpermits("transport_permit", requirementsdiv);
  } else if (statusfilter.value === "evaluated") {
    typelabel.innerText = "Evaluated";
    getevaluatedpermits(
      "transport_permit",
      evaluatedtablebody,
      requirementsdiv
    );
  } else {
    typelabel.innerText = "Rejected";
    getrejectedpermits("transport_permit", rejectedtablebody, requirementsdiv);
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});


backbtn.addEventListener("click", () => {
  modalcontenttoggler("back");
});

viewreqsbutton.addEventListener("click", () => {
  let purpose = "";
  if (permitmodal.getAttribute("permit-status") === "Pending") {
    purpose = "see requirements";
  } else if (
    permitmodal.getAttribute("permit-status") === "Evaluated" ||
    permitmodal.getAttribute("permit-status") === "Initialized by RPS Chief"
  ) {
    purpose = "evaluated";
  } else {
    purpose = "rejected";
  }
  modalcontenttoggler(purpose);
});

function initializepage() {
  getpendingpermits("transport_permit", requirementsdiv);
}

window.onload = initializepage;
