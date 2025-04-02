import { db } from "./config.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const requirementsdiv = document.querySelector('requirements');


export async function getfiles(id, elemendId, collectionname) {
  elemendId.innerHTML = "";
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

        displayPDF(file, fdoc.id, elemendId);
      } else if (
        fileExtension === ".jpg" ||
        fileExtension === ".jpeg" ||
        fileExtension === ".png"
      ) {
        console.log("images found");

        displayImage(file, fdoc.id, elemendId);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export function displayPDF(base64, filename, elemendId) {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const icon = document.createElement("h1");
  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item-pdf";
  wrapper.onclick = () => window.open(blobUrl, "_blank");
  icon.innerText = "📄";
  const label = document.createElement("h4");
  label.innerText = `${filename}`;
  wrapper.appendChild(icon);
  wrapper.appendChild(label);
  elemendId.appendChild(wrapper);
}

export function displayImage(base64, filename, elemendId) {
  const wrapper = document.createElement("div");
  wrapper.className = "requirement-item";

  const label = document.createElement("p");
  label.innerText = `${filename}`;
  const img = document.createElement("img");
  img.src = `data:image/jpeg;base64,${base64}`;
  img.alt = filename;
  img.id = "imagedisplay";

  wrapper.appendChild(img);
  wrapper.appendChild(label);
  wrapper.onclick = () => {
    const newTab = window.open();
    newTab.document.write(
      `<img src="${img.src}" style="width:100%;height:auto;">`
    );
  };

  elemendId.appendChild(wrapper);
}

// const sampleBase64 = 'JVBERi0xLjQKJc...'; // full base64 of a small PDF
// displayPDF(sampleBase64, 'Test PDF');

getfiles();

const printbtn = document.getElementById('sample');
// printbtn.addEventListener('click', ()=>{
//   print();
// })
