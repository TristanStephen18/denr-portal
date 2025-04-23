const exp_const = require('../local_modules/express_modules.js')
const controller = require('../controllers/templates_controller.js')

exp_const.router.get("/orderofpayment/:name/:address/:permittype/:permitsubtype", controller.renderOrderofPayment)

module.exports = exp_const.router;