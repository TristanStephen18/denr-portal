import { logoutfunction } from "./config.js";
import { getpendingpermits_chainsawreg } from "./datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const requirementsdiv = document.getElementById("requirements");

getpendingpermits_chainsawreg('chainsaw', requirementsdiv, 'Permit To Purchase')