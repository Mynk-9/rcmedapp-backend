// This file is used to initialize db and make associations
const Sequelize = require('sequelize');

const db = {};

// The cache configuration
var Redis = require('ioredis');
db.cache = Redis;

db.Sequelize = Sequelize; // For easier querying.
// db.sequelize = sequelize; // Connections are handled in the individual db instances
db.Op = Sequelize.Op; // Very important
db.sequelize = require('../models/public/db');
// db.public = require('./public/models');

db.public = require('./public/db');
// db.atc = require("./atc/db");

// Define all relationships here, and not in the individual files

// Permissions
// db.atc.strips.belongsTo(db.public.login, { onDelete: 'CASCADE' });
/// In case of RBAC
// db.public.permissions.belongsTo(db.public.login, { onDelete: 'CASCADE' });
// db.public.permissions.belongsTo(db.public.login, { onDelete: 'CASCADE', as: 'created_by' });
// db.public.permissions.belongsTo(db.public.policy, { onDelete: 'CASCADE' });

// db.public.kv.belongsTo(db.public.login);
module.exports = db;
