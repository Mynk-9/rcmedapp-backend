const jwt = require('jsonwebtoken');
var config = require('../config/config');
const JWTKEY = config.app.jwtKey;
var passport = require('passport');

// @Passport middleware sends 401 Unauthorized in case authentication fails (by default)
module.exports.user = passport.authenticate('jwt', { session: false });

module.exports.role = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token found.',
    });
  }
  try {
    const auth_data = jwt.verify(token, JWTKEY);
    // const role = auth_data.role;
    // console.log(role);
    // // To check if admin exists
    // var condition = role === 0 || role === 1 || role === 2;
    console.log(condition);
    if (condition) {
      req.user = auth_data;
      return next();
    } else {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized entry',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Unauthorised user or role.',
    });
  }
};
