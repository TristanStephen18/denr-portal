import { updateDateTime, sessionchecker } from "./sessionchecker.js";
import { logoutfunction, db } from "./config.js";
import {
  collection,
  onSnapshot,
  GeoPoint,
  addDoc,
  updateDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { searching, setPermitRows } from "./datahelpers.js";

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
    getforinspectiontcps();
  });
}

const schedcollection = collection(db, "tcpscheds");

// sessionchecker(username, pfpid);

const options = { month: "long", day: "numeric", year: "numeric" };

// setInterval(updateDateTime, 1000);

const collectionsToListen = {
  transport_permit: "tpnum",
  chainsaw: "crnum",
  tree_cutting: "tcpnum",
  wildlife: "wrnum",
  plantation: "pwprnum",
};

function setupSnapshotListener(collectionName, elementId) {
  const colRef = collection(db, collectionName);
  const element = document.getElementById(elementId);
  if (!element) return;

  onSnapshot(colRef, (snapshot) => {
    element.innerHTML = `${snapshot.docs.length}`;
  });
}

// Object.entries(collectionsToListen).forEach(([col, el]) => {
//   setupSnapshotListener(col, el);
// });

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
    draggable: false, // Prevent manual dragging, allow clicking
    icon: {
      url: "../images/marker.png", // URL of the custom icon
      scaledSize: new google.maps.Size(40, 40), // Resize the icon (optional)
    },
  });

  // Add click event listener to the map
  map.addListener("click", async (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    // Move the marker to the clicked location
    updateMap(clickedLat, clickedLng);

    // Fetch address using reverse geocoding
    const address = await getAddressFromCoordinates(clickedLat, clickedLng);
    if (address) {
      searchinput.value = address; // Update search input with new address
    }

    // Store selected coordinates
    selectedLat = clickedLat;
    selectedLon = clickedLng;
  });
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

document.getElementById("searchBtn").addEventListener("click", () => {
  if (selectedLat && selectedLon) {
    updateMap(selectedLat, selectedLon);
  }
});

openBtn.onclick = () => {
  modal.style.display = "block";
  addschedbtn.style.display = "";
  actionbuttons.style.display = "none";
  address.value = "";
  date.value = "";
  subject.value = "";
  personnel.value = "";
  tcptype.value = "";
  updateMap(16.404234843328066, 120.59804057928649);
  modaltitle.innerHTML = "Add an Inspection Schedule";
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
    console.log(
      subject.value + tcptype.value,
      date.value,
      personnel.value,
      address.value,
      selectedLat,
      selectedLon
    );
  }
});

async function getforinspectiontcps() {
  const modal = document.getElementById("scheduleModal");

  try {
    const schedcollection = collection(db, "tcpscheds");
    const q = query(schedcollection, orderBy("date", "desc"));
    let trcolor = "white";
    let fontcolor = "black";

    onSnapshot(q, (snapshots) => {
      schedtable.innerHTML = "";
      console.log(snapshots);
      if (snapshots.empty) {
        console.log("Collection is empty");
      } else {
        console.log("Fetching data");
        snapshots.forEach((doc) => {
          const data = doc.data();
          const row = document.createElement("tr");
          const inspectiondate = data.date.toDate().toLocaleDateString("en-US", options);
          row.innerHTML = `
            <td>${data.subject}</td>
            <td>${data.tcp_type}</td>
            <td>${data.address}</td>
            <td>${data.date.toDate().toLocaleDateString("en-US", options)}</td>
            <td>${data.personnel}</td>
            <td>${data.status}</td>`;

          row.id = `${doc.id}`;

          const datenow = new Date().toLocaleDateString("en-US", options);

          if (datenow > inspectiondate) {
            console.log("This inspection has been missed");
            trcolor = "rgb(253, 133, 133)";
            row.style.background = trcolor;
            console.log(data.subject);
          } else if (datenow == inspectiondate) {
            console.log("This inspection should be done now");
            trcolor = "rgb(152, 250, 165)";
            console.log(data.subject);

            row.style.background = trcolor;
          }

          console.log(new Date(), inspectiondate);
          row.addEventListener("click", () => {
            console.log(row.getAttribute('id'));
            
            modal.style.display = "block";
            updateMap(data.coordinates._lat, data.coordinates._long);
            addschedbtn.style.display = "none";
            actionbuttons.style.display = "";
            address.value = data.address;
            date.value = data.date.toDate().toISOString().split("T")[0];
            subject.value = data.subject;
            personnel.value = data.personnel;
            tcptype.value = data.tcp_type;
            modaltitle.innerHTML = `${data.subject}'s Tree Cutting Permit Info`;
          });

          schedtable.appendChild(row);
        });

        const allPendingRows = Array.from(schedtable.querySelectorAll("tr"));
        setPermitRows(allPendingRows);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// getforinspectiontcps();
window.onload = initializepage();
