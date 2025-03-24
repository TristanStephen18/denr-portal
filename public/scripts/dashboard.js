import {
  updateDateTime,
  sessionchecker,
} from "./sessionchecker.js";
import { logoutfunction, db } from "./config.js";
import {
  collection,
  onSnapshot,
  GeoPoint,
  addDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { getforinspectiontcps, searching } from "./datahelpers.js";

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
const schedtable = document.getElementById('schedtablebody');
const addschedbtn = document.getElementById('addschedbtn');
const searchinput = document.getElementById("locationSearch");
const subject = document.getElementById('clientName');
const date = document.getElementById('scheduleDate');
const tcptype = document.getElementById('tcptype');
const personnel = document.getElementById('personnel');
const address = document.getElementById('locationSearch');
const tablesearch = document.getElementById('tablesearch');


tablesearch.addEventListener('input', ()=>{searching(tablesearch)});


const schedcollection = collection(db, 'tcpscheds');

sessionchecker(username, pfpid);

setInterval(updateDateTime, 1000);

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

Object.entries(collectionsToListen).forEach(([col, el]) => {
  setupSnapshotListener(col, el);
});

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
  });
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
  setTimeout(() => initMap(), 200);
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

addschedbtn.addEventListener('click', async ()=>{
  if(subject.value === "" || date.value === "" || address.value === ""){
    alert('Please fill up all the fields');
  }else{
    try{
      await addDoc(schedcollection, {
        subject: subject.value,
        date: new Date(date.value), 
        address: address.value,
        personnel: personnel.value,
        tcp_type: tcptype.value,
        coordinates: new GeoPoint(selectedLat, selectedLon),
        status: 'For Inspection'
      });

      alert('Schedule added');
    }catch(error){
      console.error(error)
    }
    console.log(subject.value + tcptype.value, date.value, personnel.value, address.value, selectedLat, selectedLon);
  }
});


getforinspectiontcps(schedtable);

