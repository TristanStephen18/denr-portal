// const { name } = require("ejs");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.render("index"));
app.get("/treecuttingpermits/nationalgovernmentagencies", (req, res) => res.render("tcp_nga"));
app.get("/treecuttingpermits/publicsafetypermits", (req, res) => res.render("tcp_public"));
app.get("/treecuttingpermits/privatelandtimberpermits", (req, res) => res.render("tcp_private"));
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
app.get("/orderofpayment/:name/:address", (req, res) => {
  const name = req.params.name;
  const address = req.params.address;
  res.render("./templates/order_of_payment", { name: name, address: address });
});
app.get("/rpschiefdashboard", (req, res) => res.render("rpschief_views/rpschiefdashboard"));
app.get("/walkin", (req, res) => res.render("walk_in_permits/menu"));



app.listen(port, () =>
  console.log(`App is listening on http://localhost:3000/`)
);
