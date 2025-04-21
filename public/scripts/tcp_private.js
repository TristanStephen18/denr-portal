import { logoutfunction } from "./config.js";
import {
  searching,
  getpendingpermits_chainsawandtcp,
  getevaluatedpermits_chainsawandtcp,
  getrejectedpermits_chainsawandtcp,
} from "./datahelpers.js";

// import { logoutbtn,  } from "./constants/tableconstants.js";
import {
  tablechanger,
   statusfilter,
   searchfilter, typelabel, logoutbtn
} from "./constants/tableconstants.js";

let statusidentifier = "pending";


logoutbtn.addEventListener("click", logoutfunction);


searchfilter.addEventListener("input", () => {
  searching(statusidentifier, searchfilter);
});

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  searchfilter.value = "";
  if (statusfilter.value === "pending") {
    typelabel.innerText = "Pending";
    statusidentifier = "pending";
  } else if (statusfilter.value === "evaluated") {
    typelabel.innerText = "Evaluated";
    statusidentifier = "evaluated";
  } else {
    typelabel.innerText = "Rejected";
    statusidentifier = "rejected";
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

function initializepage() {
  getpendingpermits_chainsawandtcp(
    "tree_cutting",
    "Private Land Timber Permit"
  );
  getevaluatedpermits_chainsawandtcp(
    "tree_cutting",
    "Private Land Timber Permit"
  );
  getrejectedpermits_chainsawandtcp(
    "tree_cutting",
    "Private Land Timber Permit"
  );
}

window.onload = initializepage();
