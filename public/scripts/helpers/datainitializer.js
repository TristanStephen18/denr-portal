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

export function initializetabledata_others(permittype){
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


//save function for when needed, just alter
// export async function toggleapplication(
//   permitid,
//   userid,
//   changeto,
//   permittype,
//   client
// ) {
//   const admindoc = doc(db, `${permittype}`, permitid);
//   const userdoc = doc(db, `mobile_users/${userid}/applications`, permitid);

//   try {
//     if (changeto === "reject") {
//       Swal.fire({
//         title: `Do you want to reject the application of ${client}?`,
//         showCancelButton: true,
//         confirmButtonText: "Yes",
//         denyButtonText: "No",
//         customClass: {
//           actions: "my-actions",
//           cancelButton: "order-1 right-gap",
//           confirmButton: "order-2",
//           denyButton: "order-3",
//         },
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           await updateDoc(userdoc, {
//             status: "Rejected",
//           });
//           await updateDoc(admindoc, {
//             status: "Rejected",
//             rejected_by: username,
//             rejected_at: new Date(),
//             current_location: "User - Rejected by the admins",
//           });
//           Swal.fire(`The Application of ${client} was rejected`, "", "success");
//         }
//       });
//     } else {
//       Swal.fire({
//         title: "Mark as evaluated?",
//         showCancelButton: true,
//         confirmButtonText: "Yes",
//         denyButtonText: "No",
//         customClass: {
//           actions: "my-actions",
//           cancelButton: "order-1 right-gap",
//           confirmButton: "order-2",
//           denyButton: "order-3",
//         },
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           await updateDoc(userdoc, {
//             status: "Evaluated",
//           });
//           await updateDoc(admindoc, {
//             status: "Evaluated",
//             evaluated_by: username,
//             evaluated_at: new Date(),
//             current_location: "RPS CHIEF - Waiting for Recommending Approval",
//           });
//           Swal.fire(
//             `The Application of ${client} was marked as evaluated`,
//             "",
//             "success"
//           );
//         }
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }