"use strict";
// This file is used to initialize sequelize

const { Sequelize, Model, DataTypes } = require("sequelize");
var config = require("../../config/config");

var env = config.db.env;

const sequelize = new Sequelize(
	env.DATABASE_NAME,
	env.DATABASE_USERNAME,
	env.DATABASE_PASSWORD,
	{
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT,
		dialect: env.DATABASE_DIALECT,
		define: {
			underscored: true,
			schema: env.SCHEMA,
		},
		// this should solve timezone issue
		timezone: "+05:30",
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
			},
			useUTC: false, //for reading from database
			dateStrings: true,
			typeCast: function (field, next) {
				// for reading from database
				if (field.type === "DATE" || field.type === "DATEONLY") {
					return field.string();
				}
				return next();
			},
		},
		// socketPath : env.SOCKET_PATH,
		// dialectOptions: env.DIALECT_OPTIONS
		//  logging: false
	}
);

// Connect all the models/tables in the database to a db object,
// so everything is accessible via one object
const db = {};

db.connectDb = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connected to postgresDB!");
	} catch (err) {
		console.log(err);
		console.log("Could not connect to postgresdb :(");
	}
};

db.sequelize = sequelize;
db.Sequelize = DataTypes;

//Models/tables
db.login = require("./login.js")(sequelize, Sequelize);
// db.permissions = require('./permissions.js')(sequelize, Sequelize);
// db.policy = require('./policy.js')(sequelize, Sequelize);
db.kv = require("./kvStore.js")(sequelize, Sequelize);

//Relations
// db.profile.belongsTo(db.login, {onDelete: "CASCADE"});

module.exports = db;
