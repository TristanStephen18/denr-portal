import {
  markerAndLabels,
  marcoshighwayCoords,
  mt_pulagCoords,
  upperagno,
  lowerAgno,
} from "./constants/mapconstants.js";

let map, marker, marker2;

export function initMap(
  tcpmarkerlat,
  tcpmarkerlong,
  permittype,
  tpfromlat,
  tpfromlong,
  tptolat,
  tptolong
) {
  let connectorref, connector;
  const initialPosition = { lat: 16.404234843328066, lng: 120.59804057928649 };

  if (permittype === "Tree Cutting") {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: parseFloat(tcpmarkerlat), lng: parseFloat(tcpmarkerlong) },
      zoom: 12,
    });
    marker = new google.maps.Marker({
      map: map,
      position: {
        lat: parseFloat(tcpmarkerlat),
        lng: parseFloat(tcpmarkerlong),
      },
      draggable: false,
      icon: {
        url: "../images/marker.png",
        scaledSize: new google.maps.Size(40, 40),
      },
    });
  } else {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: parseFloat(tpfromlat), lng: parseFloat(tpfromlong) },
      zoom: 12,
    });
    marker = new google.maps.Marker({
      map: map,
      position: { lat: parseFloat(tpfromlat), lng: parseFloat(tpfromlong) },
      draggable: false,
      icon: {
        url: "../images/fromicon.png",
        scaledSize: new google.maps.Size(40, 40),
      },
    });
    marker2 = new google.maps.Marker({
      map: map,
      position: { lat: parseFloat(tptolat), lng: parseFloat(tptolong) },
      draggable: false,
      icon: {
        url: "../images/toicon.png",
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    const infoWindow1 = new google.maps.InfoWindow({
      content: `<p>Starting Point</p>`,
    });

    infoWindow1.open(map, marker);

    // marker.addListener("click", () => {
    //   infoWindow1.open(map, marker);
    // });

    const infoWindow2 = new google.maps.InfoWindow({
      content: `<p>Destination</p>`,
    });

    infoWindow2.open(map, marker2);

    // marker2.addListener("click", () => {
    //   infoWindow2.open(map, marker2);
    // });

    connectorref = [
      {lat: parseFloat(tpfromlat), lng: parseFloat(tpfromlong)},
      {lat: parseFloat(tptolat), lng: parseFloat(tptolong)},
    ];
    connector = new google.maps.Polygon({
      paths: connectorref,
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#000000",
      fillOpacity: 0.35,
    });
  }

  for (const [label, position] of Object.entries(markerAndLabels)) {
    const marker = new google.maps.Marker({
      position,
      map,
      title: label,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<p>${label}</p>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  }


  var upperagnogeofence = new google.maps.Polygon({
    paths: upperagno,
    strokeColor: "#138bef",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#138bef",
    fillOpacity: 0.35,
  });

  var marcoshighway = new google.maps.Polygon({
    paths: marcoshighwayCoords,
    strokeColor: "#22e245",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#22e245",
    fillOpacity: 0.35,
  });

  var _lowerAgno = new google.maps.Polygon({
    paths: lowerAgno,
    strokeColor: "#ffffff",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#ffffff",
    fillOpacity: 0.35,
  });

  var mt_pulag = new google.maps.Polygon({
    paths: mt_pulagCoords,
    strokeColor: "#22d606",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#06672e",
    fillOpacity: 0.35,
  });

  marcoshighway.setMap(map);
  mt_pulag.setMap(map);
  upperagnogeofence.setMap(map);
  _lowerAgno.setMap(map);
  if(permittype === "Transport Permit"){
    connector.setMap(map);
  }
}
