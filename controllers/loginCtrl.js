var jwt = require("jsonwebtoken");
var config = require("../config/config");
var db = require("../models/db");
const { use } = require("../routes");

module.exports.login = async function (req, res) {
  try {
    const userId = req.body.id;
    let user = await db.public.login.findOne({
      where: {
        firebase_id: userId,
      },
      attributes: ["id", "email", "created_at", "new_user", "total_profile"],
    });
    // console.log(user);
    if (!user) {
      // Create a new user
      var create_object = {
        firebase_id: userId,
        total_profile: 0,
      };

      db.public.login
        .create(create_object)
        .then((login_data) => {
          // The payload of the auth-token
          var auth_data = {
            firebase_id: userId,
            created_at: login_data.created_at,
            id: login_data.id,
          };
          // Create and assign an auth-token
          const TOKEN_SECRET = config.app.jwtKey;
          var token = jwt.sign(auth_data, TOKEN_SECRET);
          return res.status(200).json({
            success: true,
            authToken: token,
            newUser: login_data.new_user,
            totalProfiles: login_data.total_profile,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            success: false,
            msg: err.message || "Internal server error",
          });
        });
    } else if (user) {
      // The user has already signed-in
      // The payload of the auth-token
      var auth_data = {
        firebase_id: userId,
        created_at: user.created_at,
        id: user.id,
      };
      // Create and assign an auth-token
      const TOKEN_SECRET = config.app.jwtKey;
      var token = jwt.sign(auth_data, TOKEN_SECRET);
      return res.status(200).json({
        success: true,
        authToken: token,
        newUser: false,
        totalProfiles: user.total_profile,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.addProfile = async function (req, res) {
  try {
    const id = req.user.id;
    if (!id) throw Error("Invalid User");
    console.log({ id });
    const { name, age } = req.body;
    const newProfile = {
      name,
      age,
      login_id: req.user.id,
    };
    const profile = await db.public.profile.create(newProfile);
    const total_profile_update = await db.public.login.increment(
      "total_profile",
      {
        by: 1,
        where: { id: id },
        returning: true,
      }
    );
    let totalProflies = total_profile_update[0][0][0].total_profile;
    return res.status(200).json({
      success: true,
      profile,
      totalProflies,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.addMasterProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const data = req.body;
    const newProfile = {
      name: data.name,
      age: data.age,
      sex: data.sex,
      login_id: id,
      isMaster: true,
    };

    const already_master = await db.public.profile.findOne({
      where: { login_id: id, isMaster: true },
    });

    if (already_master) throw Error("Already added master user");

    await db.public.profile.create(newProfile);

    await db.public.login.increment("total_profile", {
      by: 1,
      where: { id: id },
      returning: true,
    });
    const user_obj = {
      name: data.name,
      age: data.age,
      email: data.email,
      mobile: data.monile,
      sex: data.sex,
      address: data.address,
      city: data.city,
      new_user: false,
    };
    const user_updated = await db.public.login.update(user_obj, {
      where: { id: id },
      returning: true,
    });
    res.status(200).json({
      success: true,
      message: "Update Successful",
      user: user_updated[1][0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: {
        message: err.message || "Internal Server Error",
        description: err.description,
      },
    });
  }
};

module.exports.updateProfile = async function (req, res) {
  try {
    const id = req.user.id;
    const profile_id = req.params.profile_id;

    const user = await db.public.profile.findOne({ where: { id: profile_id } });

    if (!user) throw Error("Invalid Id");
    const data = req.body;
    let profile;
    if (user.isMaster) {
      const updateMaster = {
        name: data.name,
        age: data.age,
        email: data.email,
        mobile: data.monile,
        sex: data.sex,
        address: data.address,
        city: data.city,
        new_user: false,
      };
      profile = await db.public.login.update(updateMaster, {
        where: { id: id },
        returning: true,
      });
      const updateProfile = {
        name: data.name,
        age: data.age,
        login_id: req.user.id,
      };
      await db.public.profile.update(updateProfile, {
        where: { id: profile_id },
        returning: true,
      });
    } else {
      const updateProfile = {
        name: data.name,
        age: data.age,
        login_id: req.user.id,
      };
      profile = await db.public.profile.update(updateProfile, {
        where: { id: profile_id },
        returning: true,
      });
    }

    return res.status(200).json({
      success: true,
      profile: profile[1][0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.getAllProfiles = async (req, res) => {
  const id = req.user.id;
  try {
    const profiles = await db.public.profile.findAll({
      where: { login_id: id },
    });
    return res.status(200).json({
      success: true,
      profiles,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.getProfile = async (req, res) => {
  const id = req.user.id;
  const profile_id = req.params.id;
  try {
    const profile = await db.public.profile.findOne({
      where: { login_id: id, id: profile_id },
    });
    const master_profile = await db.public.login.findOne({ where: { id: id } });
    return res.status(200).json({
      success: true,
      profile,
      master_profile,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};

module.exports.removeProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const profile_id = req.params.profile_id;
    const user = await db.public.profile.findOne({
      where: { login_id: id, id: profile_id },
    });
    if (user.isMaster) throw Error("Master user can't be deleted");
    const deleteProfile = await db.public.profile.destroy({
      where: { login_id: id, id: profile_id },
    });
    return res.status(200).json({
      success: true,
      deleteProfile,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error.",
    });
  }
};
