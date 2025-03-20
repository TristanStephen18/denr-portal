import { logoutfunction } from "./config.js";
import { getevaluatedpermits, getpendingpermits, searching, getrejectedpermits } from "./datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const modal = new bootstrap.Modal(document.getElementById("permitModal"));
const searchfilter = document.getElementById('searchdata');
const requirementsdiv = document.getElementById("requirements");
const statusfilter = document.getElementById('status');
const evaluatedtable = document.getElementById('evaluated-table');
const evaluatedtablebody = document.getElementById('evaluatedtbody');
const rejectedtable = document.getElementById('rejected-table');
const rejectedtablebody = document.getElementById('rejectedtbody');



const pendingtable = document.getElementById('pending-table');

const tablechanger = {
  'pending' : pendingtable,
  'evaluated' : evaluatedtable,
  'rejected': rejectedtable
}


searchfilter.addEventListener('input', () => {
  searching(searchfilter);
});

let beforechange = statusfilter.value;

statusfilter.addEventListener('change', ()=>{
  tablechanger[beforechange].style.display = "none";
  console.log(beforechange);
  beforechange = statusfilter.value;
  tablechanger[statusfilter.value].style.display = "table";
})

getpendingpermits('wildlife', requirementsdiv);
getevaluatedpermits('wildlife', evaluatedtablebody, requirementsdiv);
getrejectedpermits('wildlife', rejectedtablebody, requirementsdiv);



