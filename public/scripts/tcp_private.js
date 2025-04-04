import { logoutfunction } from "./config.js";
import {
  searching,
  getpendingpermits_chainsawandtcp,
  getevaluatedpermits_chainsawandtcp,
  getrejectedpermits_chainsawandtcp,
  toggleapplication,
} from "./datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const permitmodal = document.getElementById("permitModal");
const searchfilter = document.getElementById("searchdata");
const requirementsdiv = document.getElementById("requirements");
const statusfilter = document.getElementById("status");
const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("rejected-table");
const rejectedtablebody = document.getElementById("rejectedtbody");
const typelabel = document.getElementById("typelabel");
const datadisplayerdiv = document.getElementById("data-displayer");
const requirementsdisplayerdiv = document.getElementById(
  "requirements-displayer"
);
const viewreqsbutton = document.getElementById("viewrequirementsbtn");
const approverbtn = document.getElementById("approvebtn");
const rejectbtn = document.getElementById("rejectbtn");
const createOOPbtn = document.getElementById("createOOPbtn");
const backbtn = document.getElementById("backbtn");
const pendingabtnsdiv = document.getElementById("pending-abtns");
const evaluatedabtns = document.getElementById("evaluated-abtns");

createOOPbtn.addEventListener("click", () => {
  window.open(`/orderofpayment/${permitmodal.getAttribute("client")}/${permitmodal.getAttribute("permit-address")}`);
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

function modalcontenttoggler(purpose) {
  if (purpose === "see requirements") {
    datadisplayerdiv.style.display = "none";
    requirementsdisplayerdiv.style.display = "";
    evaluatedabtns.style.display = "none";
    pendingabtnsdiv.style.display = "";
  } else if (purpose === "back") {
    datadisplayerdiv.style.display = "";
    requirementsdisplayerdiv.style.display = "none";
  } else if (purpose === "evaluated") {
    datadisplayerdiv.style.display = "none";
    requirementsdisplayerdiv.style.display = "";
    evaluatedabtns.style.display = "";
    pendingabtnsdiv.style.display = "none";
  } else {
    datadisplayerdiv.style.display = "none";
    requirementsdisplayerdiv.style.display = "";
    evaluatedabtns.style.display = "none";
    pendingabtnsdiv.style.display = "none";
  }
}

backbtn.addEventListener("click", () => {
  modalcontenttoggler("back");
});

viewreqsbutton.addEventListener("click", () => {
  let purpose = "";
  if (permitmodal.getAttribute("permit-status") === "Pending") {
    purpose = "see requirements";
  } else if (permitmodal.getAttribute("permit-status") === "Evaluated" || permitmodal.getAttribute("permit-status") === "Initialized by RPS Chief") {
    purpose = "evaluated";
  } else {
    purpose = "rejected";
  }
  modalcontenttoggler(purpose);
});

const pendingtable = document.getElementById("pending-table");

const tablechanger = {
  pending: pendingtable,
  evaluated: evaluatedtable,
  rejected: rejectedtable,
};

searchfilter.addEventListener("input", () => {
  searching(searchfilter);
});

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  searchfilter.value = "";
  if (statusfilter.value === "pending") {
    typelabel.innerText = "Pending";
    getpendingpermits_chainsawandtcp(
      "tree_cutting",
      requirementsdiv,
      "Private Land Timber Permit"
    );
  } else if (statusfilter.value === "evaluated") {
    typelabel.innerText = "Evaluated";
    getevaluatedpermits_chainsawandtcp(
      "tree_cutting",
      requirementsdiv,
      evaluatedtablebody,
      "Private Land Timber Permit"
    );
  } else {
    typelabel.innerText = "Rejected";
    getrejectedpermits_chainsawandtcp(
      "tree_cutting",
      requirementsdiv,
      rejectedtablebody,
      "Private Land Timber Permit"
    );
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

function initializepage() {
  getpendingpermits_chainsawandtcp(
    "tree_cutting",
    requirementsdiv,
    "Private Land Timber Permit"
  );
}

window.onload = initializepage();
