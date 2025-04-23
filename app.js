const express_utilities = require("./local_modules/express_modules.js");
const path = require("path");
// const converter = require("./modules.js");

const evaluatorroutes = require("./routes/evaluator_routes.js");
const templateRoutes = require("./routes/templates_routes.js");
const applicationViewerRoutes = require("./routes/appviewer_routes.js");

express_utilities.app.set("view engine", "ejs");
express_utilities.app.use(
  express_utilities.express.static(path.join(__dirname, "public"))
);

express_utilities.app.get("/", (req, res) => res.render("index"));

express_utilities.app.use("/evaluator", evaluatorroutes);

express_utilities.app.use("/templates", templateRoutes);

express_utilities.app.get("/rpschiefdashboard", (req, res) =>
  res.render("rpschief_views/rpschiefdashboard")
);
express_utilities.app.get("/walkin", (req, res) =>
  res.render("walk_in_permits/menu")
);
express_utilities.app.use(
  "/permit", applicationViewerRoutes  
);

express_utilities.app.get(
  "/evaluation/:oop/:submissiondate/:inspectiondate",
  (req, res) => {
    console.log(
      req.params.oop,
      req.params.submissiondate,
      req.params.inspectiondate.replaceAll(",", " and ")
    );
    res.send("hello");
  }
);

express_utilities.app.listen(express_utilities.port, () =>
  console.log(`App is listening on http://localhost:3000/`)
);
