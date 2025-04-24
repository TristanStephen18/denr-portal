import { logoutfunction } from "../../helpers/config.js";
import {
  getpendingpermits,
  getevaluatedpermits,
  getInspectedPermits,
  getRecommendedPermits,
  getApprovedPermits,
  getForwardedPermits,
} from "../../helpers/datahelpers.js";

import {
  tablechanger,
  statusfilter,
  logoutbtn,
  cards,
  endorsementmodal,
} from "../../constants/tableconstants.js";
import { cancelbtn, endorsebtn } from "../../constants/evaluator_constants.js";
import { togglepermitmodal } from "../../helpers/togglers.js";

let status = "pending";
let endo_destination = "";

logoutbtn.addEventListener("click", logoutfunction);

let beforechange = statusfilter.value;

statusfilter.addEventListener("change", () => {
  if (statusfilter.value === "pending") {
    status = "pending";
  } else if (statusfilter.value === "evaluated") {
    status = "evaluated";
  } else {
    status = "rejected";
  }

  console.log(tablechanger);
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "";
});

cards.forEach((card) => {
  card.addEventListener("click", () => {
    endo_destination = card.getAttribute("destination");
    cards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});

function initializepage() {
  getpendingpermits("resaw");
  getevaluatedpermits("resaw");
  getInspectedPermits("resaw");
  getRecommendedPermits("resaw");
  getApprovedPermits("resaw");
  getForwardedPermits('resaw');
}

cancelbtn.addEventListener("click", () => {
  endorsementmodal.style.display = "none";
  endo_destination = "";
});

endorsebtn.addEventListener("click", () => {
  const permitid = endorsementmodal.getAttribute("permit-id");
  const user = endorsementmodal.getAttribute("evaluator");
  const permittype = endorsementmodal.getAttribute("permittype");
  // const permitnum = endorsementmodal.getAttribute('permitnum');
  const clientid = endorsementmodal.getAttribute("clientid");

  if (endo_destination === "") {
    // alert("You have not chosen a location/office to forward the permit to..");
    Swal.fire(
      "Choose an office/location to forward the application/permit",
      "Forwarding Error",
      "error"
    );
  } else {
    togglepermitmodal("load");
    axios
      .get(
        `/evaluator/endorsepermit/${permittype}/${permitid}/${user}/${clientid}/${endo_destination}`
      )
      .then((response) => {
        // console.log('oks')
        if (response.data === 200) {
          endorsementmodal.style.display = "none";

          Swal.fire(
            `Permit was forwarded/endorse to ${endo_destination}`,
            "Forwarding Successful",
            "success"
          ).then((re) => {
            // endorsementmodal.style.display = "none";
          });
        }
      })
      .catch((error) => {
        endorsementmodal.style.display = "none";
        Swal.fire(`${error}`, "Forwarding Error", "error");
        console.error(error);
      });
  }
});

window.onload = initializepage;
