const evaluatedtable = document.getElementById("evaluated-table");
const evaluatedtablebody = document.getElementById("evaluatedtbody");
const rejectedtable = document.getElementById("inspectedtable");
const inspectedtablebody = document.getElementById("inspectedtablebody");
const permittablebody = document.getElementById("permittablebody");
const recommendedforapprovaltbody = document.getElementById('recommendedforapprovaltbody');
const pendingtable = document.getElementById("pending-table");
const markasinspected_btn = document.getElementById('mai-btn'); 
const pendingtable_div = document.getElementById('pendingtable_div');
const evaluatedtable_div = document.getElementById('evaluatedtable_div');
const inspectedtable_div = document.getElementById('inspectedtable_div');
const rpschiefapproved_div = document.getElementById('recommendedforapproval_div');
const cenroapproved_div = document.getElementById('approvedbycenro_div');
const received_div = document.getElementById('received_div');
const receivedtbody = document.getElementById('receivedtbody');
const approvedtablebody = document.getElementById('approvedbycenrotbody');
const endorsed_div = document.getElementById('endorsed_div');
const endorsedtbody = document.getElementById('endorsedtbody');
const endorsementmodal = document.getElementById('actionmodal');
const cards = document.querySelectorAll('.card');
const loadercontent = document.getElementById('loader-content');
const choosercontent = document.getElementById('chooser-content');



const tablechanger = {
  pending: pendingtable_div,
  evaluated: evaluatedtable_div,
  inspected: inspectedtable_div,
  recommended: rpschiefapproved_div,
  approved: cenroapproved_div,
  endorsed: endorsed_div,
  received: received_div,
};

const searchfilter = document.getElementById("searchdata");
const statusfilter = document.getElementById("status");
const typelabel = document.getElementById("typelabel");
const logoutbtn = document.getElementById("logout");

export {
  approvedtablebody,
  evaluatedtable,
  evaluatedtablebody,
  rejectedtable,
  inspectedtablebody,
  permittablebody,
  pendingtable,
  tablechanger,
  searchfilter,
  statusfilter,
  logoutbtn,
  typelabel,
  markasinspected_btn,
  pendingtable_div,
  evaluatedtable_div,
  inspectedtable_div,
  recommendedforapprovaltbody,
  endorsementmodal,
  cards,
  loadercontent,
  choosercontent,
  endorsedtbody,
  received_div,
  receivedtbody
};

