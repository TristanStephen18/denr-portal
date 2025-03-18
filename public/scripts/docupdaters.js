import { db } from "./config.js";
import {
  getDocs,
  collection,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

export async function toggleapplication(permitid, userid, changeto, permittype, client) {
    const admindoc = doc(db, `${permittype}`, permitid );
    const userdoc = doc(db, `mobile_users/${userid}/applications`, permitid);

    try{
        if(changeto === 'reject'){
            Swal.fire({
                title: `Do you want to reject the application of ${client}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                  actions: 'my-actions',
                  cancelButton: 'order-1 right-gap',
                  confirmButton: 'order-2',
                  denyButton: 'order-3',
                },
              }).then(async (result) => {
                if (result.isConfirmed) {
                    await updateDoc(userdoc, {
                        status: 'Rejected'
                    });
                    await updateDoc(admindoc, {
                        status: 'Rejected'
                    });
                  Swal.fire(`The Application of ${client} was rejected`, '', 'success')
                } 
              })
        }else{
            Swal.fire({
                title: 'Mark as evaluated?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                  actions: 'my-actions',
                  cancelButton: 'order-1 right-gap',
                  confirmButton: 'order-2',
                  denyButton: 'order-3',
                },
              }).then(async(result) => {
                if (result.isConfirmed) {
                    await updateDoc(userdoc, {
                        status: 'Approved'
                    });
                    await updateDoc(admindoc, {
                        status: 'Approved'
                    });
                    Swal.fire(`The Application of ${client} was marked as evaluated`, '', 'success')

                } 
              })
        }
    }catch(error){
        console.error(error);
    }
}