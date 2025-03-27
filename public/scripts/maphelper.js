import {
  markerAndLabels,
  marcoshighwayCoords,
  mt_pulagCoords,
  upperagno,
  lowerAgno,
} from "./constants/mapconstants.js";

let map, marker;

export function initMap(markerlat, markerlong) {
  const initialPosition = { lat: 16.404234843328066, lng: 120.59804057928649 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: initialPosition,
    zoom: 13,
  });

  marker = new google.maps.Marker({
    map: map,
    position: {lat: parseFloat(markerlat), lng: parseFloat(markerlong)},
    draggable: false,
    icon: {
      url: "../images/marker.png",
      scaledSize: new google.maps.Size(40, 40),
    },
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

