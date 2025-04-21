const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("rejected-table");
const rejectedtablebody = document.getElementById("rejectedtbody");
const permittablebody = document.getElementById("permittablebody");
const pendingtable = document.getElementById("pending-table");
const markasinspected_btn = document.getElementById('mai-btn'); 

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
  markasinspected_btn
};

