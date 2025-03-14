
import {usernamegetter, updateDateTime} from './sessionchecker.js';
import {logoutfunction } from "./config.js";

const logoutbtn = document.getElementById('logout');

logoutbtn.addEventListener('click', logoutfunction);

const username = document.getElementById('username');
username.innerHTML = `${usernamegetter()}`;

setInterval(updateDateTime, 1000);





