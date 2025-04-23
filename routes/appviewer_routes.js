const exp_const = require('../local_modules/express_modules.js')
const controller = require('../controllers/appviewer_controller.js')


exp_const.router.get("/application/:client/:sn/:apptype/:maintype/:purpose", controller.renderApplicationViewer);


module.exports = exp_const.router; 