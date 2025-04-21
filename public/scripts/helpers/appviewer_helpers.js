import {
    updateDoc
  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

export async function updateAdminApplication(evaluator, doctoupdate, oop, inspection_dates, submission_date) {
  console.log(oop)
  try {
    await updateDoc(doctoupdate, {
      inspection_dates: inspection_dates,
      evaluated_by: `${evaluator}`,
      evaluated_at: new Date(),
      oop: `${oop.replaceAll("/", "")}`,
      submission_date: submission_date,
      status: "Evaluated",
      current_location: "For submission/For inspection"
    });

    Swal.fire(`Ok Bitch`, "", "success").then((sample)=>{
      window.close();
    });

  } catch (error) {
    console.error(error);
  }
}

export async function updateUserApplication(doctoupdate, inpectiondates) {
    try {
      await updateDoc(doctoupdate, {
        inspection_dates: [new Date(), new Date("2025-04-01")],
        oop: `${oop}`,
        submission_date: new Date(),
        status: "Evaluated",
      });
    } catch (error) {
      console.error(error);
    }
  }
