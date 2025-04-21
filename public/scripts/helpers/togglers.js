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


pendingpermits.forEach(({id, data}) => {
  // const data = doc.data();
  const row = document.createElement("tr");
  const evaluatebtn = document.createElement("button");
  evaluatebtn.innerHTML = "Evaluate";
  evaluatebtn.id = "e-btn";
  evaluatebtn.style =
    "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
  evaluatebtn.addEventListener("mouseenter", () => {
    evaluatebtn.style.backgroundColor = "rgb(162, 212, 162)";
    evaluatebtn.style.color = "black";
  });

  evaluatebtn.addEventListener("mouseleave", () => {
    evaluatebtn.style =
      "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
  });
  if (data.status === "Pending" && data.type === `${type}`) {
    row.setAttribute(`${permittype}-num`, id);
    row.innerHTML = `
      <td>${data.client}</td>
      <td>${id}</td>
      <td>${data.type}</td>
      <td><span class="status">${data.status}</span></td>
      <td>${data.current_location}</td>
      <td>${data.uploadedAt
        .toDate()
        .toLocaleDateString("en-US", options)}</td>
    `;

    const td = document.createElement("td");
    td.appendChild(evaluatebtn);
    row.appendChild(td);

    evaluatebtn.addEventListener("click", () => {
      // console.log(`${doc.id}`);
      window.open(
        `/application/${data.client}/${id}/${data.type}/${permittype}/evaluation`
      );
    });

    permittablebody.appendChild(row);
  }
});

const allPendingRows = Array.from(
  permittablebody.querySelectorAll("tr")
);
setPermitRows(allPendingRows);