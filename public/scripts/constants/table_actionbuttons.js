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

const viewbtn = document.createElement("button");
viewbtn.innerHTML = "View";
viewbtn.id = "e-btn";
viewbtn.style =
  "color: white; background-color: blue; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
viewbtn.addEventListener("mouseenter", () => {
  viewbtn.style.backgroundColor = "rgb(162, 212, 162)";
  viewbtn.style.color = "black";
});

viewbtn.addEventListener("mouseleave", () => {
  viewbtn.style =
    "color: white; background-color: blue; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
});

const markasinspectedbtn = document.createElement("button");
markasinspectedbtn.innerHTML = "Mark as Inspected";
markasinspectedbtn.id = "mai-btn";
markasinspectedbtn.style =
  "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
markasinspectedbtn.addEventListener("mouseenter", () => {
  markasinspectedbtn.style.backgroundColor = "rgb(162, 212, 162)";
  markasinspectedbtn.style.color = "black";
});

markasinspectedbtn.addEventListener("mouseleave", () => {
  markasinspectedbtn.style =
    "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
});

const markasrecommended = document.createElement("button");
markasrecommended.innerHTML = "Recommend for Approval";
markasrecommended.id = "mai-btn";
markasrecommended.style =
  "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
markasrecommended.addEventListener("mouseenter", () => {
  markasrecommended.style.backgroundColor = "rgb(162, 212, 162)";
  markasrecommended.style.color = "black";
});

markasrecommended.addEventListener("mouseleave", () => {
  markasrecommended.style =
    "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
});

const markasapprovedbycenro = document.createElement("button");
markasapprovedbycenro.innerHTML = "Mark as Approved";
markasapprovedbycenro.id = "mai-btn";
markasapprovedbycenro.style =
  "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
markasapprovedbycenro.addEventListener("mouseenter", () => {
  markasapprovedbycenro.style.backgroundColor = "rgb(162, 212, 162)";
  markasapprovedbycenro.style.color = "black";
});

markasapprovedbycenro.addEventListener("mouseleave", () => {
  markasapprovedbycenro.style =
    "color: white; background-color: green; border: none; padding: 8px; border-radius: 10px; width: 100px; cursor:pointer;";
});

export { evaluatebtn, viewbtn, markasinspectedbtn, markasrecommended, markasapprovedbycenro };
