import { db } from "../helpers/config.js";
import {
  getDocs,
  getDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// const requirementsdiv = document.querySelector("requirements");
import { requirementsdiv, pfpimage, oopholder } from "../constants/appviewerconstants.js";

export async function getfiles(id, collectionname) {
  requirementsdiv.innerHTML = "";
  console.log("fetching");
  console.log(collectionname);

  try {
    const filecollection = collection(
      db,
      `${collectionname}/${id}/requirements`
    );
    const filedocs = await getDocs(filecollection);

    filedocs.forEach((fdoc) => {
      const data = fdoc.data();
      console.log("fetching again");

      const { file, fileExtension, fileName } = data;

      if (fileExtension === ".pdf") {
        console.log("pdf found");

        displayPDF(file, fdoc.id);
      } else if (
        fileExtension === ".jpg" ||
        fileExtension === ".jpeg" ||
        fileExtension === ".png"
      ) {
        console.log("images found");

        displayImage(file, fdoc.id);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function createFileBox() {
  const fileBox = document.createElement("div");
  fileBox.className = "filebox";
  return fileBox;
}

export function displayPDF(base64, filename) {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const icon = document.createElement("h1");
  icon.innerText = "📄";

  const label = document.createElement("h6");
  label.innerText = filename;

  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item-pdf";
  wrapper.onclick = () => window.open(blobUrl, "_blank");
  wrapper.appendChild(icon);
  wrapper.appendChild(label);

  const fileBox = createFileBox();
  fileBox.appendChild(wrapper);
  requirementsdiv.appendChild(fileBox);
}

function displayOOP(base64) {
  oopholder.innerHTML = "";
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const icon = document.createElement("h5");
  icon.innerText = "ORDER OF PAYMENT";

  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item-pdf";
  wrapper.onclick = () => window.open(blobUrl, "_blank");
  wrapper.appendChild(icon);

  oopholder.style.cursor = "pointer";
  oopholder.appendChild(wrapper);
}


export function displayImage(base64, filename) {
  const img = document.createElement("img");
  img.src = `data:image/jpeg;base64,${base64}`;
  img.alt = filename;
  img.id = "imagedisplay";

  const label = document.createElement("h5");
  label.style.background = 'black';
  label.style.color = 'white';
  label.style.textTransform = 'uppercase';
  label.innerText = filename;

  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item";
  wrapper.onclick = () => {
    const newTab = window.open();
    newTab.document.write(
      `<img src="${img.src}" style="width:100%;height:auto;">`
    );
  };
  wrapper.appendChild(label);

  const fileBox = createFileBox();
  // file.style.background-image:
  fileBox.style.backgroundImage = `url(${img.src})`;
  fileBox.style.backgroundSize = "cover"; // Ensure the image covers the entire box
  fileBox.style.backgroundPosition = "center"; // Center the image
  fileBox.appendChild(wrapper);
  requirementsdiv.appendChild(fileBox);
}

export async function getOOP(permitdoc){
  try{
    const permitsnapshot = await getDoc(permitdoc);
    const permitdata = permitsnapshot.data();
    const oop_base64encoded = permitdata.oop;
    console.log(permitdata)
    displayOOP(oop_base64encoded);
  }catch(error){
    console.error(error)
  }
}

// export function displayclientpfp(base64){
//   const img = document.createElement("img");
//   img.src = `data:image/jpeg;base64,${base64}`;
//   img.id = "imagedisplay";

//   return img;
// }



getfiles();

const printbtn = document.getElementById("sample");
// printbtn.addEventListener('click', ()=>{
//   print();
// })
