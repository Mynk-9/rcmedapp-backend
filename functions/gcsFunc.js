var config = require("../config/config");

var Storage = require('@google-cloud/storage');

var bucket = new Storage().bucket(config.cloud.gcp.storage.bucket_name);
 
process.env.GOOGLE_APPLICATION_CREDENTIALS = config.cloud.gcp.service_account_path;


function UploadToGoogleStorage(obj_key, file_path) {

    var options = {
        destination: obj_key
    };

    console.log("Uploading to gcp with the object key");
    console.log(obj_key);

    // Actually return this promise.
    return bucket.upload(file_path, options);
    // .then(() => {
    //     console.log("The upload to cloud is success");
    // })
    // .catch(err => {
    //     console.log(err);
    //     console.log("There was an error in uploading the file to the cloud storage.");
    // });
}


function generateSignedUrl(key) {

    // Need to turn this into a promise.

    console.log("Generating signed url for the key:  " + key);

    var file = bucket.file(key);

    var expires = new Date();

    expires = new Date(expires.getTime() + 5 * 60000);

    var config = {
        action: 'read',
        expires: expires
    };

    return new Promise((resolve, reject) => {
        //
        file.getSignedUrl(config, function (err, url) {
    
            if (err) {
                console.log("There is an issue with generating the signed url");
                console.log(err);
                reject({
                    error: {
                        message: "There was an issue in generating the url"
                    }
                });
                // callback(true, null);
                return;
            }
    
            console.log("Signed url for " + key + " is generated and is \n\n\n  " + url);
            resolve(url);
            // callback(false, url);
        });
    });
}

function deleteObject(obj_key) {

    var options = {
        destination: obj_key
    };

    console.log("Uploading to gcp with the object key");
    console.log(obj_key);

    // Actually return this promise.
    return bucket.file(obj_key).delete();
    // .then(() => {
    //     console.log("The upload to cloud is success");
    // })
    // .catch(err => {
    //     console.log(err);
    //     console.log("There was an error in uploading the file to the cloud storage.");
    // });
}


module.exports = {
    upload: UploadToGoogleStorage,
    getURL: generateSignedUrl,
    deleteObject: deleteObject
};
