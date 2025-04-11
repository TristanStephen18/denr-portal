import { logoutfunction } from "./config.js";
import {
  searching,
  getpendingpermits_chainsawandtcp,
  getevaluatedpermits_chainsawandtcp,
  getrejectedpermits_chainsawandtcp,
} from "./datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const searchfilter = document.getElementById("searchdata");
// const requirementsdiv = document.getElementById("requirements");
const statusfilter = document.getElementById("status");
const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("rejected-table");
const rejectedtablebody = document.getElementById("rejectedtbody");
const typelabel = document.getElementById("typelabel");

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
  } else if (statusfilter.value === "evaluated") {
    typelabel.innerText = "Evaluated";
  } else {
    typelabel.innerText = "Rejected";
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

function initializetabledata(){
  getpendingpermits_chainsawandtcp(
    "chainsaw",
    "Chainsaw Registration"
  );
  getevaluatedpermits_chainsawandtcp(
    "chainsaw",
    evaluatedtablebody,
    "Chainsaw Registration"
  );
  getrejectedpermits_chainsawandtcp(
    "chainsaw",
    rejectedtablebody,
    "Chainsaw Registration"
  );
}

window.onload = initializetabledata;