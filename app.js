const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const amounttoword = require("./modules");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.render("index"));
app.get("/treecuttingpermits/nationalgovernmentagencies", (req, res) =>
  res.render("tcp_nga")
);
app.get("/treecuttingpermits/publicsafetypermits", (req, res) =>
  res.render("tcp_public")
);
app.get("/treecuttingpermits/privatelandtimberpermits", (req, res) =>
  res.render("tcp_private")
);
app.get("/privatetreeplantationregistrations", (req, res) =>
  res.render("ptpr")
);
app.get("/wildliferegistrations", (req, res) => res.render("wildlife"));
app.get("/chainsaw/registration", (req, res) => res.render("chainsaw_reg"));
app.get("/chainsaw/permittosell", (req, res) => res.render("chainsaw_pts"));
app.get("/chainsaw/permittopurchase", (req, res) => res.render("chainsaw_ptp"));
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/transportpermits", (req, res) => res.render("transport_permits"));
app.get("/decoder", (req, res) => res.render("decoder"));
app.get(
  "/orderofpayment/:name/:address/:permittype/:permitsubtype",
  (req, res) => {
    let datatodisplay;

    const permitsubtype = req.params.permitsubtype;
    const permittype = req.params.permittype;
    const name = req.params.name;
    const address = req.params.address;

    datatodisplay = amounttoword.getdatatodisplay(
      name,
      address,
      permittype,
      permitsubtype
    );

    console.log(datatodisplay);

    res.render("./templates/order_of_payment", { data: datatodisplay });
  }
);
app.get("/rpschiefdashboard", (req, res) =>
  res.render("rpschief_views/rpschiefdashboard")
);
app.get("/walkin", (req, res) => res.render("walk_in_permits/menu"));
app.get("/application/:client/:sn/:apptype/:maintype/:purpose", (req, res) => {
  const client = req.params.client;
  res.render("application_viewer", { client: client, sn: req.params.sn, apptype: req.params.apptype, permittype: req.params.maintype, purpose: req.params.purpose });
});

app.post('/sample', upload.single('oopfile'),(req, res) => {
  // Handle file upload
  // res.send('sample')
  console.log(req.file);
  
});
//base64encoded too large use client side
app.get('/evaluation/:oop/:submissiondate/:inspectiondate', (req, res)=>{
  console.log(req.params.oop, req.params.submissiondate, req.params.inspectiondate.replaceAll(',', " and "));
  res.send('hello')
});

app.listen(port, () =>
  console.log(`App is listening on http://localhost:3000/`)
);
