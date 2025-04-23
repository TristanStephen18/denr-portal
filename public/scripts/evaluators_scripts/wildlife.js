import { logoutfunction } from "../helpers/config.js";
import {
  getpendingpermits,
  getevaluatedpermits,
  getInspectedPermits,
  getRecommendedPermits,
  getApprovedPermits
} from "../helpers/datahelpers.js";

import {
  tablechanger,
   statusfilter,
   logoutbtn,
   cards
} from "../constants/tableconstants.js";

let status = "pending";

logoutbtn.addEventListener("click", logoutfunction);

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

  console.log(tablechanger)
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "";
});

cards.forEach((card) => {
  card.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('selected')); // Remove from all
    card.classList.add('selected'); // Add to the one clicked
  });
});

function initializepage() {
  getpendingpermits("wildlife");
  getevaluatedpermits("wildlife");
  getInspectedPermits("wildlife");
  getRecommendedPermits("wildlife");
  getApprovedPermits("wildlife");
}

window.onload = initializepage;
