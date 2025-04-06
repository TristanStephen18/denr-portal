export function modalcontenttoggler(purpose) {
  const pendingabtnsdiv = document.getElementById("pending-abtns");
  const evaluatedabtns = document.getElementById("evaluated-abtns");
  const datadisplayerdiv = document.getElementById("data-displayer");
  const requirementsdisplayerdiv = document.getElementById(
    "requirements-displayer"
  );

  if (purpose === "see requirements") {
    datadisplayerdiv.style.display = "none";
    requirementsdisplayerdiv.style.display = "";
    evaluatedabtns.style.display = "none";
    pendingabtnsdiv.style.display = "";
  } else if (purpose === "back") {
    datadisplayerdiv.style.display = "";
    requirementsdisplayerdiv.style.display = "none";
  } else if (purpose === "evaluated" || "initialized") {
    datadisplayerdiv.style.display = "none";
    requirementsdisplayerdiv.style.display = "";
    evaluatedabtns.style.display = "";
    pendingabtnsdiv.style.display = "none";
  } else {
    datadisplayerdiv.style.display = "none";
    requirementsdisplayerdiv.style.display = "";
    evaluatedabtns.style.display = "none";
    pendingabtnsdiv.style.display = "none";
  }
}
