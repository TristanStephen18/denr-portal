export const renderApplicationViewer = (req, res) => {
    const client = req.params.client;
    res.render("permitviewer/application_viewer", {
      client: client,
      sn: req.params.sn,
      apptype: req.params.apptype,
      permittype: req.params.maintype,
      purpose: req.params.purpose,
    });
  }