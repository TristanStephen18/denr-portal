import { logoutfunction } from "./config.js";
import {
  searching,
  getpendingpermits,
  getevaluatedpermits,
  getrejectedpermits
} from "./datahelpers.js";

import {
  tablechanger,
   statusfilter,
   searchfilter, typelabel, logoutbtn
} from "./constants/tableconstants.js";

let status = "pending";

logoutbtn.addEventListener("click", logoutfunction);

searchfilter.addEventListener("input", () => {
  searching(status, searchfilter);
});

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  searchfilter.value = "";
  if (statusfilter.value === "pending") {
    status = "pending";
    typelabel.innerText = "Pending";
  } else if (statusfilter.value === "evaluated") {
    status = "evaluated";
    typelabel.innerText = "Evaluated";
  } else {
    status = "rejected";
    typelabel.innerText = "Rejected";
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

function initializepage() {
  getpendingpermits("wildlife");
  getevaluatedpermits("wildlife");
  getrejectedpermits("wildlife");
}

window.onload = initializepage;
