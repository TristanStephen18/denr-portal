const {db} = require('../local_modules/firebasemodules.js')
const exp_const = require('../local_modules/express_modules.js')

exports.gethomepage = (req, res)=>res.render('evaluators/dashboard')

exports.getChainsaw = (req, res)=>{
    const navigator = req.params.nav;

    switch (navigator) {
        case "permittosell":
            res.render('evaluators/chainsaw_pts')
            break;
        case "permittopurchase":
            res.render('evaluators/chainsaw_ptp')
        break;
    
        default:
            res.render('evaluators/chainsaw_reg')
            break;
    }
}

exports.getTreeCutting = (req, res) =>{
    const navigator = req.params.nav;

    switch (navigator) {
        case "publicsafetypermits":
            res.render('evaluators/tcp_public')
            break;
        case "privatelandtimberpermits":
            res.render('evaluators/tcp_private')
        break;
    
        default:
            res.render('evaluators/tcp_nga')
            break;
    }
}


exports.getWildlife = (req, res) =>{
    res.render('evaluators/wildlife')
}

exports.getPTPR = (req, res) => res.render('evaluators/ptpr')

exports.getTransportPermits = (req, res) => res.render('evaluators/transport_permits')

exports.markasInspected = async (req, res) => {
    console.log(req.params.permittype);
    console.log(req.params.permitnum)
    const permitref = db.collection(`${req.params.permittype}`).doc(`${req.params.permitnum}`);

    await permitref.update({
        status: "ahsjdgasjd",
        sample: new Date()
    }).then((result)=>{
        console.log('Success');
        res.send('200')
        // res.status(200);
    }).catch((error)=>{
        console.log(error);
        // res.status(400);
        res.send('400')
    });
}