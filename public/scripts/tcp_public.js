import { logoutfunction } from "./config.js";
import {
  searching,
  getpendingpermits_chainsawandtcp,
  getevaluatedpermits_chainsawandtcp,
  getrejectedpermits_chainsawandtcp,
} from "./datahelpers.js";

import {
  tablechanger,
   statusfilter,
   searchfilter, typelabel, logoutbtn
} from "./constants/tableconstants.js";



logoutbtn.addEventListener("click", logoutfunction);

searchfilter.addEventListener("input", () => {
  searching(searchfilter);
});

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  searchfilter.value = "";
  if (statusfilter.value === "pending") {
    typelabel.innerText = "Pending";
    getpendingpermits_chainsawandtcp("tree_cutting", "Public Safety Permit");
  } else if (statusfilter.value === "evaluated") {
    typelabel.innerText = "Evaluated";
    getevaluatedpermits_chainsawandtcp("tree_cutting", "Public Safety Permit");
  } else {
    typelabel.innerText = "Rejected";
    getrejectedpermits_chainsawandtcp("tree_cutting", "Public Safety Permit");
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

function initializepage() {
  getpendingpermits_chainsawandtcp("tree_cutting", "Public Safety Permit");
}

window.onload = initializepage();
