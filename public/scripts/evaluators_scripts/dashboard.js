import { updateDateTime, sessionchecker } from "../helpers/sessionchecker.js";
import { logoutfunction, db } from "../helpers/config.js";
import {
  collection,
  onSnapshot,
  GeoPoint,
  addDoc,
  query,
  orderBy,
  doc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import {
  markerAndLabels,
  marcoshighwayCoords,
  upperagno,
  lowerAgno,
  mt_pulagCoords,
} from "../constants/mapconstants.js";

import { collectionsToListen } from "../constants/firebaseconstants.js";

import {
  searching,
  setPermitRows,
  updatetreecuttingdetails,
} from "../helpers/datahelpers.js";

const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", logoutfunction);

const pfpid = document.getElementById("pfp");
let map,
  marker,
  selectedLat = null,
  selectedLon = null;

const modal = document.getElementById("scheduleModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close");
const username = document.getElementById("username");
const schedtable = document.getElementById("schedtablebody");
const addschedbtn = document.getElementById("addschedbtn");
const searchinput = document.getElementById("locationSearch");
const subject = document.getElementById("clientName");
const date = document.getElementById("scheduleDate");
const tcptype = document.getElementById("tcptype");
const personnel = document.getElementById("personnel");
const address = document.getElementById("locationSearch");
const actionbuttons = document.getElementById("action-buttons");
const modaltitle = document.getElementById("modal-title");
const savebtn = document.getElementById("savebtn");
const markasdone = document.getElementById("markasdone");
const markasapproved = document.getElementById("markasapproved");
const typeFilter = document.getElementById("typeFilter");
const implementationdaterdiv = document.getElementById("implementationdater");
const datadisplayerdiv = document.getElementById("datadisplayer");
const scheduleimplementationbtn = document.getElementById(
  "setimplementationbtn"
);
const implementationdateinput = document.getElementById("implementationdate");
const backbutton = document.getElementById("backbutton");
const tableheader = document.getElementById("tablehead");
const clientNameLabel = document.getElementById('clientNamelabel');
const tcptypelabel = document.getElementById('tcptypelabel');
const datelabel = document.getElementById('datelabel');
const personnellabel = document.getElementById('personnellabel');
const locationlabel = document.getElementById('locationlabel');
const searchbtn = document.getElementById("searchBtn");


backbutton.addEventListener("click", () => {
  togglemodaldisplay("view");
});

scheduleimplementationbtn.addEventListener("click", () => {
  if (implementationdateinput.value === "") {
    alert("Choose a date of implementation");
  } else {
    const docid = modal.getAttribute("tcpid");
    const tcpdoc = doc(db, `tcpscheds`, `${docid}`);
    const updatedata = {
      status: "Approved for Implementation",
      implementation_date: new Date(implementationdateinput.value),
    };
    updatetreecuttingdetails(tcpdoc, updatedata);
    togglemodaldisplay("view");
    modal.style.display = "none";
  }
});

typeFilter.addEventListener("change", (e) => {
  // console.log(typeFilter.value);
  getforinspectiontcps(`${typeFilter.value}`);
  tableheadetoggler(typeFilter.value);
  tablesearch.value = "";
});

savebtn.addEventListener("click", () => {
  const docid = modal.getAttribute("tcpid");
  const tcpdoc = doc(db, `tcpscheds`, `${docid}`);
  const updatedata = {
    address: address.value,
    coordinates: new GeoPoint(selectedLat, selectedLon),
    date: new Date(date.value),
    personnel: personnel.value,
    subject: subject.value,
    tcp_type: tcptype.value,
  };
  updatetreecuttingdetails(tcpdoc, updatedata);
});

markasdone.addEventListener("click", () => {
  const docid = modal.getAttribute("tcpid");
  const tcpdoc = doc(db, `tcpscheds`, `${docid}`);
  updatetreecuttingdetails(tcpdoc, { status: "Inspected" });
});

markasapproved.addEventListener("click", () => {
  const docid = modal.getAttribute("tcpid");
  const tcpdoc = doc(db, `tcpscheds`, `${docid}`);
  implementationdaterdiv.style.display = "";
  datadisplayerdiv.style.display = "none";
  // updatetreecuttingdetails(tcpdoc, { status: "Approved for Implementation" });
});

const tablesearch = document.getElementById("tablesearch");

tablesearch.addEventListener("input", () => {
  searching(tablesearch);
});

function initializepage() {
  initMap();
  sessionchecker(username, pfpid);
  setInterval(updateDateTime, 1000);
  Object.entries(collectionsToListen).forEach(([col, el]) => {
    setupSnapshotListener(col, el);
    getforinspectiontcps("For Inspection");
  });
}

const schedcollection = collection(db, "tcpscheds");

const options = { month: "long", day: "numeric", year: "numeric" };


function setupSnapshotListener(collectionName, elementId) {
  const colRef = collection(db, collectionName);
  const element = document.getElementById(elementId);
  if (!element) return;

  onSnapshot(colRef, (snapshot) => {
    element.innerHTML = `${snapshot.docs.length}`;
  });
}

async function fetchAutocomplete(query) {
  const apiKey = "pk.b0f5e288ece5a120e06b41f5b56d7d12";
  const apiUrl = `https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(
    query
  )}&limit=5`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch autocomplete data.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching autocomplete results:", error);
    return [];
  }
}

function initMap() {
  const initialPosition = { lat: 16.404234843328066, lng: 120.59804057928649 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: initialPosition,
    zoom: 13,
  });

  marker = new google.maps.Marker({
    map: map,
    position: initialPosition,
    draggable: false,
    icon: {
      url: "../images/marker.png",
      scaledSize: new google.maps.Size(40, 40),
    },
  });

  map.addListener("click", async (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    updateMap(clickedLat, clickedLng);

    const address = await getAddressFromCoordinates(clickedLat, clickedLng);
    if (address) {
      searchinput.value = address; 
    }

    selectedLat = clickedLat;
    selectedLon = clickedLng;
  });

  for (const [label, position] of Object.entries(markerAndLabels)) {
    const marker = new google.maps.Marker({
      position,
      map,
      title: label,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${label}</h3>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  }

  var upperagnogeofence = new google.maps.Polygon({
    paths: upperagno,
    strokeColor: "#e033ff",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#e033ff",
    fillOpacity: 0.35,
  });

  // Create first polygon
  var marcoshighway = new google.maps.Polygon({
    paths: marcoshighwayCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });

  var _lowerAgno = new google.maps.Polygon({
    paths: lowerAgno,
    strokeColor: "#44453f",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FFFFFF",
    fillOpacity: 0.35,
  });

  var mt_pulag = new google.maps.Polygon({
    paths: mt_pulagCoords,
    strokeColor: "#33ff3c",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#33ff3c",
    fillOpacity: 0.35,
  });

  marcoshighway.setMap(map);
  mt_pulag.setMap(map);
  upperagnogeofence.setMap(map);
  _lowerAgno.setMap(map);
}

async function getAddressFromCoordinates(lat, lon) {
  const apiKey = "pk.b0f5e288ece5a120e06b41f5b56d7d12"; // Replace with your actual API key
  const apiUrl = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch address.");
    const data = await response.json();

    return data.display_name; // Returns full address
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}

function updateMap(lat, lon) {
  const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
  map.panTo(newPos);
  marker.setPosition(newPos);
}

searchinput.addEventListener("input", async (e) => {
  const query = e.target.value;
  const results = await fetchAutocomplete(query);
  const list = document.getElementById("autocompleteResults");
  list.innerHTML = "";

  results.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.display_name;
    li.addEventListener("click", () => {
      selectedLat = item.lat;
      selectedLon = item.lon;
      document.getElementById("locationSearch").value = item.display_name;
      list.innerHTML = "";
    });
    list.appendChild(li);
  });

  if (results.length > 0) {
    selectedLat = results[0].lat;
    selectedLon = results[0].lon;
  }
});

searchbtn.addEventListener("click", () => {
  if (selectedLat && selectedLon) {
    updateMap(selectedLat, selectedLon);
  }
});

openBtn.onclick = () => {
  modal.style.display = "block";
  addschedbtn.style.display = "";
  actionbuttons.style.display = "none";
  markasapproved.style.display = "none";
  address.value = "";
  date.value = "";
  subject.value = "";
  personnel.value = "";
  tcptype.value = "";
  updateMap(16.404234843328066, 120.59804057928649);
  modaltitle.innerHTML = "Add an Inspection Schedule";
  togglebuttons("add");
  togglemodaldisplay("view");
  togglefieldlabelsandsearchbtn('For adding');
  togglefields(false);
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

addschedbtn.addEventListener("click", async () => {
  if (subject.value === "" || date.value === "" || address.value === "") {
    Swal.fire({
      title: `Please fill up all the fields first`,
    });
  } else {
    try {
      await addDoc(schedcollection, {
        subject: subject.value,
        date: new Date(date.value),
        address: address.value,
        personnel: personnel.value,
        tcp_type: tcptype.value,
        coordinates: new GeoPoint(selectedLat, selectedLon),
        status: "For Inspection",
      });

      subject.value = "";
      tcptype.value = "";
      date.value = "";
      personnel.value = "";
      address.value = "";

      alert("Schedule added");
    } catch (error) {
      console.error(error);
    }
  }
});

async function getforinspectiontcps(statusfilter) {
  const modal = document.getElementById("scheduleModal");

  try {
    const schedcollection = collection(db, "tcpscheds");
    const q = query(schedcollection, orderBy("date", "desc"));
    let trcolor = "white";
    let fontcolor = "black";

    onSnapshot(q, (snapshots) => {
      schedtable.innerHTML = "";
      // console.log(snapshots);
      if (snapshots.empty) {
        // console.log("Collection is empty");
      } else {
        // console.log("Fetching data");
        snapshots.forEach((doc) => {
          const data = doc.data();
          if (data.status === `${statusfilter}`) {
            let rowstring = "";
            const fielddata = {
              address: data.address,
              subject: data.subject,
              date: data.date.toDate().toISOString().split("T")[0],
              tcp_type: data.tcp_type,
              personnel: data.personnel,
            };

            if (statusfilter === "Approved for Implementation") {
              rowstring = `
            <td>${data.subject}</td>
            <td>${data.tcp_type}</td>
            <td>${data.address}</td>
            <td>${data.implementation_date
              .toDate()
              .toLocaleDateString("en-US", options)}</td>
            <td>${data.status}</td>`;
            } else {
              rowstring = `
            <td>${data.subject}</td>
            <td>${data.tcp_type}</td>
            <td>${data.address}</td>
            <td>${data.date.toDate().toLocaleDateString("en-US", options)}</td>
            <td>${data.personnel}</td>
            <td>${data.status}</td>`;
            }

            const row = document.createElement("tr");
            const inspectiondate = data.date
              .toDate()
              .toLocaleDateString("en-US", options);
            row.innerHTML = rowstring;

            row.id = `${doc.id}`;

            // console.log(new Date(), inspectiondate);
            if (statusfilter === "For Inspection") {
              const datenow = new Date().toLocaleDateString("en-US", options);
              if (new Date(datenow) > new Date(inspectiondate)) {
                trcolor = "rgb(253, 133, 133)";
              } else if (datenow == inspectiondate) {
                // console.log("This inspection should be done now");
                trcolor = "rgb(152, 250, 165)";
              } else {
                trcolor = "white";
              }
              row.style.background = trcolor;
              row.addEventListener("click", () => {
                // console.log(row.getAttribute("id"));
                modal.setAttribute("tcpid", `${doc.id}`);
                modal.style.display = "block";
                setfielddata(fielddata);
                updateMap(data.coordinates._lat, data.coordinates._long);
                modaltitle.innerHTML = `${data.subject}'s Tree Cutting Permit Info`;
                togglefields(false);
                togglebuttons("edit");
                togglefieldlabelsandsearchbtn('For Inspection');
              });
            } else if (statusfilter === "Inspected") {
              row.addEventListener("click", () => {
                // alert("Inspected");
                // console.log(row.getAttribute("id"));
                setfielddata(fielddata);
                modal.setAttribute("tcpid", `${doc.id}`);
                modal.style.display = "block";
                updateMap(data.coordinates._lat, data.coordinates._long);
                modaltitle.innerHTML = `${data.subject}'s Tree Cutting Permit Info`;
                togglefields(true);
                togglebuttons("approval");
                togglefieldlabelsandsearchbtn('Inspected');
              });
            } else {
              row.addEventListener("click", () => {
                modal.setAttribute("tcpid", `${doc.id}`);
                modal.style.display = "block";
                setfielddata(fielddata);
                updateMap(data.coordinates._lat, data.coordinates._long);
                modaltitle.innerHTML = `${data.subject}'s Tree Cutting Permit Info`;
                togglefields(true);
                togglebuttons("Approved");
                togglemodaldisplay("view");
                togglefieldlabelsandsearchbtn('For Implementation');
              });
            }

            schedtable.appendChild(row);
          }
        });

        const allPendingRows = Array.from(schedtable.querySelectorAll("tr"));
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    // console.log(error);
  }
}

function togglefields(toggle) {
  address.disabled = toggle;
  subject.disabled = toggle;
  tcptype.disabled = toggle;
  personnel.disabled = toggle;
  date.disabled = toggle;
}

function togglebuttons(filter) {
  if (filter === "add") {
    addschedbtn.style.display = "";
    actionbuttons.style.display = "none";
    markasapproved.style.display = "none";
  } else if (filter === "edit") {
    addschedbtn.style.display = "none";
    actionbuttons.style.display = "";
    markasapproved.style.display = "none";
  } else if (filter === "approval") {
    addschedbtn.style.display = "none";
    actionbuttons.style.display = "none";
    markasapproved.style.display = "";
  } else {
    addschedbtn.style.display = "none";
    actionbuttons.style.display = "none";
    markasapproved.style.display = "none";
  }
}

function setfielddata(data) {
  address.value = data.address;
  date.value = data.date;
  subject.value = data.subject;
  personnel.value = data.personnel;
  tcptype.value = data.tcp_type;
}

function togglemodaldisplay(purpose) {
  if (purpose === "view") {
    datadisplayerdiv.style.display = "";
    implementationdaterdiv.style.display = "none";
  } else {
    datadisplayerdiv.style.display = "none";
    implementationdaterdiv.style.display = "";
  }
}

function tableheadetoggler(filter) {
  tableheader.innerHTML = "";
  let headerreplacerstring = "";
  if (filter === "For Inspection") {
    headerreplacerstring = `
    <th>Client/Subject</th>
      <th>Type</th>
      <th>Address</th>
      <th>Inspection Date</th>
      <th>Assigned Personnel</th>
      <th>Status</th>`;
  } else if (filter === "Inspected") {
    headerreplacerstring = `
    <th>Client/Subject</th>
    <th>Type</th>
    <th>Address</th>
    <th>Date of Inspection</th>
    <th>Inspected By</th>
    <th>Status</th>`;
  } else {
    headerreplacerstring = `
    <th>Client/Subject</th>
    <th>Type</th>
    <th>Address</th>
    <th>Implementation Date</th>
    <th>Status</th>`;
  }

  tableheader.innerHTML = headerreplacerstring;
}


function togglefieldlabelsandsearchbtn(status){
  switch (status) {
    case 'Inspected':
      datelabel.innerHTML = "Date of Inspection: ";
      clientNameLabel.innerHTML = "Client / Subject: ";
      locationlabel.innerHTML = "Location of Inspection: ";
      personnellabel.innerHTML = "Inspected by: ";
      tcptypelabel.innerHTML = "Tree Cutting Permit Type: ";
      searchbtn.style.display = "none";
      break;
    case 'For Implementation':
      datelabel.innerHTML = "Date of Inspection: ";
      clientNameLabel.innerHTML = "Client / Subject: ";
      locationlabel.innerHTML = "Location of Inspection: ";
      personnellabel.innerHTML = "Inspected by: ";
      tcptypelabel.innerHTML = "Tree Cutting Permit Type: ";
      searchbtn.style.display = "none";
      break;
    default:
      datelabel.innerHTML = "Choose date for Inspection: ";
      clientNameLabel.innerHTML = "Name of the Client / Subject: ";
      locationlabel.innerHTML = "Location of Inspection: ";
      personnellabel.innerHTML = "Choose a personnel: ";
      tcptypelabel.innerHTML = "Choose Tree Cutting Permit Type: ";
      searchbtn.style.display = "";
      break;
  }
}

// getforinspectiontcps();
window.onload = initializepage();
