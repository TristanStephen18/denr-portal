const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("rejected-table");
const rejectedtablebody = document.getElementById("rejectedtbody");
const permittablebody = document.getElementById("permittablebody");
const pendingtable = document.getElementById("pending-table");

const tablechanger = {
  pending: pendingtable,
  evaluated: evaluatedtable,
  rejected: rejectedtable,
};

const searchfilter = document.getElementById("searchdata");
const statusfilter = document.getElementById("status");
const typelabel = document.getElementById("typelabel");
const logoutbtn = document.getElementById("logout");

export {
  evaluatedtable,
  evaluatedtablebody,
  rejectedtable,
  rejectedtablebody,
  permittablebody,
  pendingtable,
  tablechanger,
  searchfilter,
  statusfilter,
  logoutbtn,
  typelabel,
};

const viewbtn = document.createElement("button");
viewbtn.innerHTML = "Evaluate";
viewbtn.id = "e-btn";
viewbtn.style =
  "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
viewbtn.addEventListener("mouseenter", () => {
  viewbtn.style.backgroundColor = "rgb(162, 212, 162)";
  viewbtn.style.color = "black";
});

viewbtn.addEventListener("mouseleave", () => {
  viewbtn.style =
    "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
});
