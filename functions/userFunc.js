var fs = require('fs');
var path = require('path');
var request = require("request-promise");

var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var roleFunc = require("./roleFunc");
var uuid = require('uuid/v4');
var jwt = require("jsonwebtoken");
// Check this: https://github.com/request/request-promise

async function verifyToken(token){
    return jwt.decrypt(token, config.app.jwtKey);
}



async function addUserToPolicy(user_credentials, policy_id, user_id, entity_id, org_id) {
    // This is the beta version of the new IAM system.
    try{
        //
        // let role_id = req.body.role_id;
        // let entity_id = req.body.entity_id;
        // let user_id = req.body.user_id;

        let permission_object = await db.public.policy.findOne({
            where: {
                id: policy_id
            }
        });

        if(!permission_object){
            return {
                success: false,
                message: 'Invalid Policy id'
            };
        }
        let create_object = {
            login_id: user_id || user_credentials.id,
            org_id: org_id,
            policy_id: policy_id,
            role: null,
            entity_name: null, // Has to be taken from the role layer
            entity_id: null // Has to be taken from the role layer.
        };

        console.log('The create object is');
        console.log(create_object);

        // var is_role_already_exists = await db.public.permissions.findOne({
        //     where: create_object
        // });

        // if (is_role_already_exists) {
        //     console.log("The role already exists");
        //     res.status(200).json({
        //         success: false,
        //         error: {
        //             message: "The user has already been added to the role"
        //         }
        //     });
        //     return;
        // }

        var entity_to_query = permission_object.entity_name;

        let db_obj = db;
        if(entity_to_query != '*'){
            //
            entity_to_query = entity_to_query.split('.');
    
    
            for(let i of entity_to_query){
                console.log('in ' + i);
    
                if(db_obj[i]){
                    //
                    db_obj = db_obj[i];
                }
            }
        }

        
        let entity_exists = {};
        if (entity_id != 0 || entity_id != '0') {
            // If it is not a wildcard entry
            entity_exists = await db_obj.findOne({
                where: {
                    id: entity_id
                }
            });

            if(!entity_exists){
                return {
                    success: false,
                    message: "The entity does not exist. Please try again"
                };
            }
        }

        var user_exists = await db.public.login.findOne({
            where: {
                id: create_object.login_id
            }
        });

        if (!user_exists) {
            console.log("The user does not exist. Time to add the email or mobile number");
            create_object.mobile = req.body.mobile;
            create_object.email = req.body.email;
        }

        // Allowed check starts here
        // Now, here, query the entity and get the roles 

        var db_entity_record = await db.public.policy.findOne({
            where: {
                entity_name: permission_object.entity_name,
                type: 'db_entity'
            }
        });

        let allowed_check = db_entity_record.roles;
        let is_allowed = await roleFunc.verifyRole(
            user_credentials,
            create_object.entity_name,
            create_object.entity_id,
             '*',
            create_object.org_id
            );
        

        if(!is_allowed.success){
            // Time to check the corresponding dicts
            console.log('Doing a deeper check');
            // var allowed_check = limited_access[create_object.entity_name];

            if(allowed_check){
                //
                for(i of allowed_check){
                    //
                    is_allowed = await roleFunc.verifyRole(
                        user_credentials,
                        i[0],
                        entity_exists[i[2]],
                        '*',
                        create_object.org_id
                    );

                    if(is_allowed.success){
                        break;
                    }
                }
            }

        }
        if(is_allowed.success){
            // The user is an admin and can be allowed to grant permissions.
            console.log("Admin user here, is allowed to grant for permission");
            create_object.created_by_id = user_credentials.id;
            create_object.status = new Date();
        } else {
            create_object.login_id = user_credentials.id;
            if(create_object.role == '*'){
                return {
                    success: false,
                    message: "The user is not allowed to request root role"
                };
            }
        }

        // Allowed check ends here
        create_object.other_data = {
            session_origin: uuid()
        };

        // Wild card check. See if he is trying to bypass wildcard limitations or so.
        let wildcard_heirichy = [
            ['org_id', '0'],
            ['entity_name', '*'],
            ['entity_id', '0']
        ], where_obj;


        let roles = permission_object.roles;

        // Start a transaction here.
        let transaction = await db.public.sequelize.transaction();

        // await transaction.commit() // To commit the transaction
        // await transaction.rollback() // To rollback the transaction
        console.log("The transaction has been initiated");
        let policy_added_to_db = null;
        for(i of roles){
            //
            create_object.entity_name = i[0];
            create_object.role = i[1];
            if(i[2] != '0' && entity_id != '0' && entity_id != 0){
                create_object.entity_id = entity_exists[i[2]]
            } else {
                create_object.entity_id = i[2];
            }

            //  Now comes the wildcard check

            console.log("Wildcard loop");
            for(var i of wildcard_heirichy){
                console.log("checking");
                console.log(i);
                if(create_object[i[0]] == i[1]){
                    console.log("Wildcard check");
                    // Check if the entity permission of the user assigning has role: *, with the particuclar entity.
                    where_obj = {
                        role: '*'
                    };

                    where_obj[i[0]] = i[1];
                    is_allowed = await db.public.permissions.findOne({
                        where: where_obj,
                        transaction: transaction
                    });

                    if(!is_allowed){
                        console.log("The user is not allowed the access the role");
                        console.log(i);
                        let transaction_declined = await transaction.rollback();
                        return {
                            success: false,
                            message: "The user is not allowed to assign the particular policy/role",
                            transaction: transaction_declined
                        };
                    } else {
                        console.log("Allowed for:  " + i);
                    }
                }
            }

            // Policy passed wildcard check. adding it to the db
            policy_added_to_db = await db.public.permissions.create(create_object, {
                transaction: transaction
            });
        }

        let transaction_success = await transaction.commit();
        return {
            success: true,
            message: 'Successfully added the user to the policy',
            transaction: transaction_success
        };

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: "Internal Server Error",
            description: err.message
        };
    }
}



module.exports = {
    verifyToken: verifyToken,
    addUserToPolicy: addUserToPolicy
};
