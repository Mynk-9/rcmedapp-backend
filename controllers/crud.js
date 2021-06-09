var db = require('../models/db');
var config = require('../config/config');
// var utilities = require('../utilities/utilities');

async function create(req, res) {
  try {
    //
    // console.log('hey');
    let create_obj = {
      key: req.body.key,
      value: req.body.value,
    };

    let kv_created = await db.public.kv.create(create_obj);

    res.status(200).json({
      success: true,
      kv: kv_created,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal Server Error',
        description: err.description,
      },
    });
  }
}

async function get(req, res) {
  try {
    //
    let query = {};

    if (req.query.key) {
      query.key = req.query.key;
    }

    let values = await db.public.kv.findAll({
      where: query,
    });

    res.status(200).json({
      success: true,
      kv: values,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal Server Error',
        description: err.description,
      },
    });
  }
}

module.exports = {
  create,
  get,
};
