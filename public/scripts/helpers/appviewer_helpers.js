import {
    updateDoc
  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

export async function updateAdminApplication(evaluator, doctoupdate, inspection_dates, submission_date) {
  try {
    await updateDoc(doctoupdate, {
      inspection_dates: inspection_dates,
      evaluated_by: `${evaluator}`,
      evaluated_at: new Date(),
      submission_date: submission_date,
      status: "Evaluated",
      current_location: "For submission/For inspection"
    });
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserApplication(doctoupdate, inpectiondates, oop, adminname) {
    try {
      await updateDoc(doctoupdate, {
        inspection_dates: inpectiondates,
        oop: `${oop}`,
        submission_date: new Date(),
        status: "Evaluated",
        evaluated_by: adminname,
        evaluated_at: new Date()
      });

      Swal.fire(`Permit Evaluated Successfully`, "", "success").then((sample)=>{
        window.close();
      });
    } catch (error) {
      console.error(error);
    }
  }
