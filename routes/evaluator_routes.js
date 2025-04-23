const exp_const = require('../local_modules/express_modules.js')
const controller = require('../controllers/evaluator_controller.js')


exp_const.router.get('/dashboard', controller.gethomepage);

exp_const.router.get('/chainsaw/:nav', controller.getChainsaw);

exp_const.router.get('/treecuttingpermits/:nav', controller.getTreeCutting)

exp_const.router.get('/wildliferegistrations', controller.getWildlife)

exp_const.router.get('/transportpermits', controller.getTransportPermits)

exp_const.router.get('/privatetreeplantationregistrations', controller.getPTPR);

exp_const.router.get('/markasinspected/:permittype/:permitnum/:evaluator/:clientid', controller.markasEvaluated)

exp_const.router.get('/notifyclient/:permittype/:permitnum/:evaluator/:clientid', controller.evaluationnotif) 

exp_const.router.get('/recommendforapproval/:permittype/:permitnum/:evaluator/:clientid', controller.recommendForApproval) 

exp_const.router.get('/approvepermit/:permittype/:permitnum/:evaluator/:clientid', controller.cenroApproved)  


module.exports = exp_const.router;