import { logoutfunction } from "../../helpers/config.js";
import {
  searching,
  getpendingpermits_chainsawandtcp,
  getevaluatedpermits_chainsawandtcp,
  getrejectedpermits_chainsawandtcp,
} from "../../helpers/datahelpers.js";

import {
  tablechanger,
   statusfilter,
   logoutbtn
} from "../../constants/tableconstants.js";

let status = "pending";

logoutbtn.addEventListener("click", logoutfunction);

// searchfilter.addEventListener("input", () => {
//   searching(status, searchfilter);
// });

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  // searchfilter.value = "";
  if (statusfilter.value === "pending") {
    status = "pending";
    // typelabel.innerText = "Pending";
  } else if (statusfilter.value === "evaluated") {
    status = "evaluated";
    // typelabel.innerText = "Evaluated";
  } else {
    status = "rejected";
    // typelabel.innerText = "Rejected";
  }
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
});

function initializetabledata(){
  // getpendingpermits_chainsawandtcp(
  //   "chainsaw",
  //   "Permit To Sell"
  // );
  // getevaluatedpermits_chainsawandtcp(
  //   "chainsaw",
  //   "Permit To Sell"
  // );
  // getrejectedpermits_chainsawandtcp(
  //   "chainsaw",
  //   "Permit To Sell"
  // );
}

window.onload = initializetabledata;