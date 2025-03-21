import { logoutfunction } from "./config.js";
import { getpendingpermits, searching, getevaluatedpermits, getrejectedpermits } from "./datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const searchfilter = document.getElementById('searchdata');
const requirementsdiv = document.getElementById("requirements");
const statusfilter = document.getElementById("status");
const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("rejected-table");
const rejectedtablebody = document.getElementById("rejectedtbody");
const typelabel = document.getElementById('typelabel');

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
    getpendingpermits("transport_permit", requirementsdiv);
  } else if (statusfilter.value === "evaluated") {
    typelabel.innerText = "Evaluated";
    getevaluatedpermits("transport_permit", evaluatedtablebody, requirementsdiv);
  } else {
    typelabel.innerText = "Rejected";
    getrejectedpermits("transport_permit", rejectedtablebody, requirementsdiv);
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

getpendingpermits('transport_permit', requirementsdiv);
