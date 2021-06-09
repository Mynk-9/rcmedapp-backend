var express = require('express');
var router = express.Router();

// var themes = require("../controllers/themeCtrl");
// var atcStrip = require("../controllers/atcStripCtrl");
var login = require('../controllers/loginCtrl');
var atc = require('../controllers/atc-strips-no-cache');
var crud = require('../controllers/crud');
const verify = require('../functions/verifyFunc');
// // Login and onboarding
// router.post('/register', login.register);
router.post('/login', login.login);

// // ATC and the ATC Strips
// router.get('/atc/strips', atc.getAll);
// router.get('/atc/progress/strip', atc.get);
// router.post('/atc/strip/create', atc.create);
// router.delete('/atc/strip/delete', atc.delete);

// router.post("/request/permission", login.requestPermission);
// router.post("/grant/permission", login.allotPermission);
// router.get("/get/user/team", login.getUserTeams);
// router.get('/search/user', login.userFullTs);

router.post('/create/kv', verify.user, crud.create);
router.get('/get/kv', crud.get);

module.exports = router;
