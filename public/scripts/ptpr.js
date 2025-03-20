import { logoutfunction } from "./config.js";
import { getpendingpermits, searching } from "./datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const searchfilter = document.getElementById("searchdata");
const requirementsdiv = document.getElementById("requirements");

searchfilter.addEventListener("input", () => {
  searching(searchfilter);
});

getpendingpermits("plantation", requirementsdiv);
