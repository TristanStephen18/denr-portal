import { getpendingpermits_chainsawandtcp, getevaluatedpermits_chainsawandtcp, getrejectedpermits_chainsawandtcp, getpendingpermits, getevaluatedpermits, getrejectedpermits } from "../datahelpers";

export function initializetabledata_tcp_chainsaw(permittype, permitsubtype){
    getpendingpermits_chainsawandtcp(
        `${permittype}`,
        `${permitsubtype}`
      );
      getevaluatedpermits_chainsawandtcp(
        `${permittype}`,
        `${permitsubtype}`
      );
      getrejectedpermits_chainsawandtcp(
        `${permittype}`,
        `${permitsubtype}`
      );
}

export function initializetabledata_others(permittype, permitsubtype){
    getpendingpermits(
        `${permittype}`,
        `${permitsubtype}`
      );
      getevaluatedpermits(
        `${permittype}`,
        `${permitsubtype}`
      );
      getrejectedpermits(
        `${permittype}`,
        `${permitsubtype}`
      );
}