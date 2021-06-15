var express = require("express");
var router = express.Router();

// var themes = require("../controllers/themeCtrl");
// var atcStrip = require("../controllers/atcStripCtrl");
var login = require("../controllers/loginCtrl");
var medicine = require("../controllers/medicineCtrl");
var atc = require("../controllers/atc-strips-no-cache");
var crud = require("../controllers/crud");
const verify = require("../functions/verifyFunc");
const medicineReminder = require("../models/public/medicineReminder");
// // Login and onboarding
// router.post('/register', login.register);
router.post("/login", login.login);
router.post("/addProfile", verify.user, login.addProfile);
router.post("/addMasterProfile", verify.user, login.addMasterProfile);

router.put("/profile/:profile_id", verify.user, login.updateProfile);

router.get("/allProfiles", verify.user, login.getAllProfiles);
router.get("/profile/:id", verify.user, login.getProfile);

router.delete("/profile/:profile_id", verify.user, login.removeProfile);

router.post("/addMedicine", verify.user, medicine.addMedicine);
router.put("/medicine/:medicine_id", verify.user, medicine.updateMedicine);
router.delete("/medicine/:medicine_id", verify.user, medicine.deleteMedicine);
router.get(
  "/medicines/:profile_id",
  verify.user,
  medicine.getAllMedicineByProfileId
);
router.get("/medicine/:medicine_id", verify.user, medicine.getMedicineById);

// // ATC and the ATC Strips
// router.get('/atc/strips', atc.getAll);
// router.get('/atc/progress/strip', atc.get);
// router.post('/atc/strip/create', atc.create);
// router.delete('/atc/strip/delete', atc.delete);

// router.post("/request/permission", login.requestPermission);
// router.post("/grant/permission", login.allotPermission);
// router.get("/get/user/team", login.getUserTeams);
// router.get('/search/user', login.userFullTs);

router.post("/create/kv", verify.user, crud.create);
router.get("/get/kv", crud.get);

module.exports = router;
