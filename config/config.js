var db = {
  staging: {
    DATABASE_HOST: "ec2-34-193-112-164.compute-1.amazonaws.com",
    DATABASE_NAME: "ddb53u17gb87hr",
    DATABASE_USERNAME: "gcawgyeclccptc",
    DATABASE_PASSWORD:
      "62c1eedfe5834a41f9ebfb9e92eae40407eb168adbf0e10614eee9858ae96b77",
    DATABASE_PORT: 5432,
    DATABASE_DIALECT: "postgres",
    NODE_ENV: process.env.NODE_ENV || "staging",
    SCHEMA: "public",
  },
  prod: {
    DATABASE_HOST: "ec2-18-235-109-97.compute-1.amazonaws.com",
    DATABASE_NAME: "serveit-backend",
    DATABASE_USERNAME: "jbtrmjtpbhhdmf",
    DATABASE_PASSWORD:
      "b84b664c54ebc97895031dfad836a61d24bf85a67ad74ad578ee5b11e49ff42b",
    DATABASE_PORT: 5432,
    DATABASE_DIALECT: "postgres",
    NODE_ENV: "production",
    SCHEMA: "public",
  },

  rg: {
    DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
    DATABASE_NAME: process.env.DATABASE_NAME || "rcmedapp",
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || "postgres",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "kani",
    DATABASE_PORT: process.env.DATABASE_PORT || 5432,
    DATABASE_DIALECT: process.env.DATABASE_DIALECT || "postgres",
    NODE_ENV: process.env.NODE_ENV || "development",
    SCHEMA: "public",
  },
};

var cache = {
  rg: {
    host: "localhost",
    port: 6379,
  },
};

var config = {
  dialect: "postgres",
  app: {
    jwtKey: "yehrcmedapp",
    sessionKey: "SecretSessionKey",
    port: process.env.PORT || "4192",
    name: "generic Services API Platform",
    local_domain:
      "http://localhost:" + (process.env.PORT || "4192") + "/api/v1",
  },

  db: {
    env: db.rg, // This is where we set the environment of the db
    cache: cache.rg,
  },

  apiKeys: {
    sendGrid: "",
  },
  cloud: {
    gcp: {
      service_account_path:
        "./config/creds/firebase-admin-sdk-service-account.json",
      project_id: "generic-services",
      storage: {
        bucket_name: "generic-services.appspot.com",
      },
      firebase: {
        server_key: "the server key",
      },
    },
  },
};

module.exports = config;

// To convert js config to json
if (require.main == module) {
  var fs = require("fs");
  var path = require("path");

  console.log("The current config is \n\n\n");

  var config_string = JSON.stringify(config, null, 4);
  console.log(config_string);
  console.log("\n\n\n");

  // Write the config string to a file here, most preferably app_config.json
  var file_path = path.join(__dirname, "app_config.json");
  console.log("Saving the config file at:  " + file_path);
  console.log("\n\n\n");

  // fs.writeFile(file_path, config_string, function (err) {
  //     if (err) {
  //         console.log("There is an error in writing the data to the file");
  //         console.log(err);
  //     } else {
  //         console.log('config file saved');
  //     }
  // });
}
