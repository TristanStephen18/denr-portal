import { db } from "./config.js";
import {
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initMap } from "./maphelper.js";

import { defaultpfp, pfpimage, clientaddress, clientcontact, clientname, clientemail, permitaddress, requirementsdiv, clientinitials } from "./constants/appviewerconstants.js";
import { getfiles } from "./decoder.js";

let userid = "";

async function getuserdata(userid) {
    const userdoc = doc(db, 'mobile_users', `${userid}`);
    const usersnapshot = await getDoc(userdoc);
    const userdata = usersnapshot.data();
    if(userdata.changedpfp == null){
        setdefaultpfp(userdata.name);
    }else{
        defaultpfp.style.display = "none";
        pfpimage.style.display = "";
    }

    clientaddress.value =  `${userdata.address}`;
    clientname.value = `${userdata.name}`;
    clientcontact.value = `${userdata.contact}`;
    clientemail.value = `${userdata.email}`;

}

async function getpermitdata(permitid, permittype) {
    const permitdoc = doc(db, `${permittype}`, `${permitid}`);
    const snapshot = await getDoc(permitdoc);
    const data = snapshot.data();
    userid = data.userID;
    getuserdata(userid);
    if(permittype === "tree_cutting"){
        initMap(data.location._lat, data.location._long, "Tree Cutting", "", "", "", "");
        permitaddress.value = `${data.tcp_location}`;
    }else{
        console.log('Transport permit');
    }
}

function initializepage(){
    getpermitdata(newpermitid, newpermittype);
    getfiles(newpermitid, newpermittype);
}

function setdefaultpfp(cname){
    cname = cname.toUpperCase();
    const nameseparated = cname.split(" ");
    if(nameseparated.length === 1){
        clientinitials.innerHTML = `${nameseparated[0].split('')[0]}`;
    }else{
        clientinitials.innerHTML = `${nameseparated[0].split('')[0]}${nameseparated[nameseparated.length - 1].split('')[0]}`;
    }
    

}

window.onload = initializepage;

// alert(newpermittype)