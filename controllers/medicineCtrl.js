const config = require("../config/config");
const db = require("../models/db");
const profile = require("../models/public/profile");

module.exports.addMedicine = async function (req, res) {
  try {
    if (!req.body.profile_id) throw Error("Please give profile id of patient");
    const {
      profile_id,
      medicine_name,
      medicine_type,
      timing,
      duration,
      dosage,
    } = req.body;

    const newMedicine = {
      medicine_name,
      medicine_type,
      timing,
      duration,
      dosage,
      profile_id: req.body.profile_id,
    };

    const medicine = await db.public.medicineReminder.create(newMedicine);

    return res.status(200).json({
      success: true,
      medicine,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.updateMedicine = async function (req, res) {
  try {
    const medicine_id = req.params.medicine_id;
    const { medicine_name, medicine_type, timing, duration, dosage } = req.body;

    const updatedMedicine = {
      medicine_name,
      medicine_type,
      timing,
      duration,
      dosage,
    };

    const medicine = await db.public.medicineReminder.update(updatedMedicine, {
      where: { id: medicine_id },
      returning: true,
    });
    console.log(medicine);

    return res.status(200).json({
      success: true,
      medicine: medicine[1][0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.getAllMedicineByProfileId = async function (req, res) {
  try {
    const profile_id = req.params.profile_id;

    const medicines = await db.public.medicineReminder.findAll({
      where: { profile_id: profile_id },
      returning: true,
    });

    return res.status(200).json({
      success: true,
      medicine: medicines,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.deleteMedicine = async function (req, res) {
  try {
    const medicine_id = req.params.medicine_id;

    const medicine = await db.public.medicineReminder.destroy({
      where: { id: medicine_id },
    });

    return res.status(200).json({
      success: true,
      medicine: medicine,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.getMedicineById = async (req, res) => {
  try {
    const medicine_id = req.params.medicine_id;

    const medicine = await db.public.medicineReminder.findOne({
      where: { id: medicine_id },
    });

    return res.status(200).json({
      success: true,
      medicine: medicine,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};
