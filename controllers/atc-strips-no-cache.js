// This is for reference only. Not to be used anywhere
var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var userFunc = require("../functions/userFunc");
var roleFunc = require("../functions/roleFunc");


// For testing purposes as there is no token issuing authority

let user_credentials = {
    id: 2
}


// In the utilities/createdb.js file, we are creating 2 new users,  id 1 and 2. These users are also being given the permissions for the necessary data that they are accessing, there as well. Check the corresponding handler functions in utilities/createdb.js

// DISCLAIMER:  All the functions here are for reference purposes only and are to be modified for certain uses when used in production

module.exports.create = async function(req, res){

    
    // var user_credentials = utilities.decryptJWTWithToken(req.get("X-AUTH-TOKEN"));

    // if (!user_credentials) {
    //     res.status(401).json({
    //         success: false,
    //         error: {
    //             message: "Unauthorized for transaction"
    //         }
    //     });
    //     return;
    // }

    try{
        //
        // user_auth_data = await userFunc.authorizeUser(user_credentials);
    
        // if(!user_auth_data.success){
        //     res.status(401).json({
        //         success: false,
        //         error: {
        //             message: "User not authorized for the transaction"
        //         }
        //     });
        //     return;
        // }


        create_obj = {
            type: req.body.type,
            make: req.body.make,
            wake: req.body.wake,
            callsign: req.body.callsign,
            alt: req.body.alt,
            speed: req.body.speed,
            rnw: req.body.rnw,
            status: 0 || req.body.status,
            login_id: user_credentials.id
        };

        for(i in create_obj){
            if(!create_obj[i]){
                res.status(200).json({
                    success: false,
                    error: {
                        message: "The field " + i + " is a required"
                    }
                });
                return;
            }
        }
        // Now, create this slit
        var atc_strip = await db.atc.strips.create(create_obj);

        res.status(200).json({
            success: true,
            strip: atc_strip
        });
        //
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err.message
            }
        });
        return;
    }
}

module.exports.getAll = async function(req, res){
    // Time to get all the users

    // var user_credentials = utilities.decryptJWTWithToken(req.get("X-AUTH-TOKEN"));

    // if (!user_credentials) {
    //     res.status(401).json({
    //         success: false,
    //         error: {
    //             message: "Unauthorized for transaction"
    //         }
    //     });
    //     return;
    // }

    try {
        //
        // user_auth_data = await userFunc.authorizeUser(user_credentials);

        // if(!user_auth_data.success){
        //     res.status(401).json({
        //         success: false,
        //         error: {
        //             message: "User not authorized for the transaction"
        //         }
        //     });
        //     return;
        // } 


        let replacements = {
            login_id: user_credentials.id
        }


        // The idea is this, with this query, we are able to guage all the permissions of a user and the scope of his/her access and query all the entities he can access. This eliminates the use of any pivot tables, however, we need to ensure that proper procedures are set up to delete the permissions once the entity is deleted


        // In short this is source of truth validation for the whole project.


        // However, I am not saying that we should not use pivot tables. I would also use pivot tables in case if there are any additional user specific data points that the ACL does not satisfy. 

        // It is just that in this case, I dont need one. However, make sure that you know what you are doing when writing your controllers and schemas

        let query = `
        SELECT distinct(strips.id), strips.type, strips.login_id from atc.strips as strips
        JOIN permissions ON(
            (permissions.entity_name IN ('atc.strips') AND permissions.entity_id = strips.id) 

            OR (permissions.entity_name IN ('*', 'atc.strips') AND permissions.entity_id = '0')
        )

        WHERE permissions.login_id = :login_id
        AND permissions.role in ('*', 'r', 'l')

        `;

        let strips = await db.atc.sequelize.query(query, {
            replacements: replacements,
            type: db.atc.sequelize.QueryTypes.SELECT
        });

        res.status(200).json({
            success: true,
            strips: strips,
            count: strips.length
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err.message
            }
        });
        return;
    }

}

module.exports.get = async function (req, res) {
    // Time to get all the users

    // var user_credentials = utilities.decryptJWTWithToken(req.get("X-AUTH-TOKEN"));

    // if (!user_credentials) {
    //     res.status(401).json({
    //         success: false,
    //         error: {
    //             message: "Unauthorized for transaction"
    //         }
    //     });
    //     return;
    // }

    try {
        //
        // user_auth_data = await userFunc.authorizeUser(user_credentials);

        // if(!user_auth_data.success){
        //     res.status(401).json({
        //         success: false,
        //         error: {
        //             message: "User not authorized for the transaction"
        //         }
        //     });
        //     return;
        // } 

        // Here, I am checking if the user has read permission to get a particular strip. Ideally, users with read or * permission is allowed to access the strip.

        // However, if you are handling heriarchal data, then in a few days time, there will be a code snippet which will help you handle herircal data and cluster grouping. In the meantime, if you figure out a way for that, Then Ill add your code into the boilerplate and Ill give you credits.

        let user_allowed = await roleFunc.verifyRole(user_credentials, 'atc.strips', req.query.id, 'r', user_credentials.org_id);

        if(!user_allowed.success){
            res.status(401).json({
                success: false,
                error: {
                    message: "User is not allowed for the transaction"
                }
            });
            return;
        }


        if(!req.query.id){
            res.status(200).json({
                success: false,
                error: {
                    message: "id is a required field"
                }
            });
            return;
        }
        let strip = await db.atc.strips.findOne({
            where: {
                id: req.query.id
            }
        });

        res.status(200).json({
            success: true,
            strip: strip,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err.message
            }
        });
        return;
    }

}

module.exports.delete = async function (req, res) {
    // Time to get all the users

    // var user_credentials = utilities.decryptJWTWithToken(req.get("X-AUTH-TOKEN"));

    // if (!user_credentials) {
    //     res.status(401).json({
    //         success: false,
    //         error: {
    //             message: "Unauthorized for transaction"
    //         }
    //     });
    //     return;
    // }

    try {
        // Basically, here have the function which checks for the user data
        // user_auth_data = await userFunc.authorizeUser(user_credentials);

        // if(!user_auth_data.success){
        //     res.status(401).json({
        //         success: false,
        //         error: {
        //             message: "User not authorized for the transaction"
        //         }
        //     });
        //     return;
        // } 


        // Same explanation as .get() function but in this case, I am checking for write permissions
        let user_allowed = await roleFunc.verifyRole(user_credentials, 'atc.strips', req.query.id, 'w', user_credentials.org_id);

        if (!user_allowed.success) {
            res.status(401).json({
                success: false,
                error: {
                    message: "User is not allowed for the transaction"
                }
            });
            return;
        }

        if (!req.query.id) {
            res.status(200).json({
                success: false,
                error: {
                    message: "id is a required field"
                }
            });
            return;
        }


        let strips = await db.atc.strips.destroy({
            where: {
                id: req.get.id
            }
        });

        res.status(200).json({
            success: true,
            strips: strips,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err.message
            }
        });
        return;
    }

}

