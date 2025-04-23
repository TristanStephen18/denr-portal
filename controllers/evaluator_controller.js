const { db, admin } = require("../local_modules/firebasemodules.js");
const exp_const = require("../local_modules/express_modules.js");

exports.gethomepage = (req, res) => res.render("evaluators/dashboard");

exports.getChainsaw = (req, res) => {
  const navigator = req.params.nav;

  switch (navigator) {
    case "permittosell":
      res.render("evaluators/chainsaw_pts");
      break;
    case "permittopurchase":
      res.render("evaluators/chainsaw_ptp");
      break;

    default:
      res.render("evaluators/chainsaw_reg");
      break;
  }
};

exports.getTreeCutting = (req, res) => {
  const navigator = req.params.nav;

  switch (navigator) {
    case "publicsafetypermits":
      res.render("evaluators/tcp_public");
      break;
    case "privatelandtimberpermits":
      res.render("evaluators/tcp_private");
      break;

    default:
      res.render("evaluators/tcp_nga");
      break;
  }
};

exports.getWildlife = (req, res) => {
  res.render("evaluators/wildlife");
};

exports.getPTPR = (req, res) => res.render("evaluators/ptpr");

exports.getTransportPermits = (req, res) =>
  res.render("evaluators/transport_permits");

exports.markasEvaluated = async (req, res) => {
  var permit_identifier = permitidentifierfunction(req.params.permittype);
  const permitref = db
    .collection(`${req.params.permittype}`)
    .doc(`${req.params.permitnum}`);
  const clientref = db
    .collection("mobile_users")
    .doc(`${req.params.clientid}`)
    .collection("applications")
    .doc(`${req.params.permitnum}`);

  await permitref
    .update({
      status: "Inspected",
      current_location: "Waiting for RPS Chief Initialization",
      inspected_at: new Date(),
      updated_by: req.params.evaluator,
    })
    .then(async (result) => {
      await clientref
        .update({
          status: "Inspected",
          updated_by: req.params.evaluator,
          inspected_at: new Date(),
        })
        .then((result) => {
          // sendNotification(
          //   "inspected",
          //   req.params.clientid,
          //   req.params.permitnum,
          //   permit_identifier
          // );
          res.send("200");
        })
        .catch((error) => {
          console.log(error);
          res.send("400");
        });
    })
    .catch((error) => {
      console.log(error);
      res.send("400");
    });
};

exports.recommendForApproval = async (req, res) => {
  var permittype = permitidentifierfunction(req.params.permittype);
  console.log(permittype);
  const permitref = db
    .collection(`${req.params.permittype}`)
    .doc(`${req.params.permitnum}`);
  const clientref = db
    .collection("mobile_users")
    .doc(`${req.params.clientid}`)
    .collection("applications")
    .doc(`${req.params.permitnum}`);

  await permitref
    .update({
      status: "Recommended for Approval",
      current_location: "Pending CENRO Approval",
      updated_at: new Date(),
      updated_by: req.params.evaluator,
    })
    .then(async (result) => {
      await clientref
        .update({
          status: "Recommended for Approval",
          updated_by: req.params.evaluator,
          updated_at: new Date(),
        })
        .then((result) => {
          res.send("200");
        })
        .catch((error) => {
          console.log(error);
          res.send("400");
        });
    })
    .catch((error) => {
      console.log(error);
      res.send("400");
    });
};

exports.cenroApproved = async (req, res) => {
  var permittype = permitidentifierfunction(req.params.permittype);
  console.log(permittype);
  const permitref = db
    .collection(`${req.params.permittype}`)
    .doc(`${req.params.permitnum}`);
  const clientref = db
    .collection("mobile_users")
    .doc(`${req.params.clientid}`)
    .collection("applications")
    .doc(`${req.params.permitnum}`);

  await permitref
    .update({
      status: "Approved by CENRO for Release/Endorsement",
      current_location: "RPU Office",
      updated_at: new Date(),
      updated_by: req.params.evaluator,
    })
    .then(async (result) => {
      await clientref
        .update({
          status: "Approved by CENRO for Release/Endorsement",
          updated_by: req.params.evaluator,
          updated_at: new Date(),
        })
        .then((result) => {
          sendNotification(
            "approved",
            req.params.clientid,
            req.params.permitnum,
            permittype
          );
          res.send("200");
        })
        .catch((error) => {
          console.log(error);
          res.send("400");
        });
    })
    .catch((error) => {
      console.log(error);
      res.send("400");
    });
};

exports.evaluationnotif = (req, res) => {
  var permit_identifier = "";
  switch (req.params.permittype) {
    case "tree_cutting":
      permit_identifier = "Tree Cutting Permit";
      break;
    case "transport_permit":
      permit_identifier = "Transport Permit";
      break;

    case "chainsaw":
      permit_identifier = "Chainsaw Permit/Registration";
      break;
    default:
      permit_identifier = "Other permits";
      break;
  }

  try {
    sendNotification(
      "evaluated",
      req.params.clientid,
      req.params.permitnum,
      permit_identifier
    );
    console.log("permit successfully evaluated");
    res.send("200");
  } catch (error) {
    console.log(error);
    res.send("400");
  }
};

const sendNotification = async (action_done, id, permitnum, permittype) => {
  let notifend = "";
  let bodymessage = "";

  switch (action_done) {
    case "evaluated":
      notifend = "by the chosen/assigned inspectors";
      bodymessage = `Your ${permittype} No. ${permitnum} has been ${action_done} ${notifend}`;
      break;

    case "approved":
      notifend = "and is ready for releasing/endorsing";
      bodymessage = `Your ${permittype} No. ${permitnum} has been approved by our CENR Officer ${notifend}`;

    default:
      notifend = "by the evaluators";
      bodymessage = `Your ${permittype} No. ${permitnum} has been ${action_done} ${notifend}`;
      break;
  }
  const clientdoc = db.collection("mobile_users").doc(id);
  const data = await clientdoc.get();

  console.log(id);
  const usertoken = data.data().token;
  console.log(data.data().token);

  const message = {
    notification: {
      title: "DENR-CAR Permit/Application Update",
      body: `${bodymessage}`,
    },
    token: `${usertoken}`,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const permitidentifierfunction = (id) => {
  var permit_identifier = "";
  switch (id) {
    case "tree_cutting":
      permit_identifier = "Tree Cutting Permit";
      break;
    case "transport_permit":
      permit_identifier = "Transport Permit";
      break;

    case "chainsaw":
      permit_identifier = "Chainsaw Permit/Registration";
      break;

    case "wildlife":
      permit_identifier = "Wildlife Registration";
      break;
    default:
      permit_identifier = "Plantation and Wood Processing Registration";
      break;
  }

  return permit_identifier;
};
