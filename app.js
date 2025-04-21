const express_utilities = require('./local_modules/express_modules.js')
const path = require('path')
const converter = require('./modules.js')

const evaluatorroutes = require('./routes/evaluator_routes.js')

express_utilities.app.set("view engine", "ejs");
express_utilities.app.use(express_utilities.express.static(path.join(__dirname, "public")));

express_utilities.app.get("/", (req, res) => res.render("index"));

express_utilities.app.use("/evaluator", evaluatorroutes);

express_utilities.app.get(
  "/orderofpayment/:name/:address/:permittype/:permitsubtype",
  (req, res) => {
    let datatodisplay;

    const permitsubtype = req.params.permitsubtype;
    const permittype = req.params.permittype;
    const name = req.params.name;
    const address = req.params.address;

    datatodisplay = converter.getdatatodisplay(
      name,
      address,
      permittype,
      permitsubtype
    );

    console.log(datatodisplay);

    res.render("./templates/order_of_payment", { data: datatodisplay });
  }
);
express_utilities.app.get("/rpschiefdashboard", (req, res) =>
  res.render("rpschief_views/rpschiefdashboard")
);
express_utilities.app.get("/walkin", (req, res) => res.render("walk_in_permits/menu"));
express_utilities.app.get("/application/:client/:sn/:apptype/:maintype/:purpose", (req, res) => {
  const client = req.params.client;
  res.render("application_viewer", { client: client, sn: req.params.sn, apptype: req.params.apptype, permittype: req.params.maintype, purpose: req.params.purpose });
});

express_utilities.app.get('/evaluation/:oop/:submissiondate/:inspectiondate', (req, res)=>{
  console.log(req.params.oop, req.params.submissiondate, req.params.inspectiondate.replaceAll(',', " and "));
  res.send('hello')
});

express_utilities.app.listen(express_utilities.port, () =>
  console.log(`App is listening on http://localhost:3000/`)
);
