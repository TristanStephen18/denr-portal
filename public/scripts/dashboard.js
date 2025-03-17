
import {usernamegetter, updateDateTime} from './sessionchecker.js';
import {logoutfunction, db } from "./config.js";
import {
    getDocs,
    collection,
  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
  

const logoutbtn = document.getElementById('logout');

logoutbtn.addEventListener('click', logoutfunction);

const username = document.getElementById('username');
username.innerHTML = `${usernamegetter()}`;

setInterval(updateDateTime, 1000);

const tpnum = document.getElementById('tpnum');

async function quantitygetter(){
    try{
        const tpcollection = collection(db,'transport_permit');
        const snapshots = await getDocs(tpcollection);
        console.log(snapshots.docs.length);
        tpnum.innerHTML = "";
        tpnum.innerHTML = `${snapshots.docs.length}`;
    }catch(error){
        console.error(error);
    }
}

quantitygetter();



