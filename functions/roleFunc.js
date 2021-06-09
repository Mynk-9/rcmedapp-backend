var db = require("../models/db");
var config = require("../config/config");

async function verifyRole(user_credentials, entity, entity_id, role_level, org_id){

    // return new Promise(async (resolve, reject) => {

    var role = '';

    var permissions_where_obj = {
        where: {
            login_id: user_credentials.id,
            entity_name: {
                [db.Op.or]: ['*', entity]
            },
            entity_id: {
                [db.Op.or]: [0, entity_id]
            },
            status: {
                [db.Op.ne]: null
            },
            deleted_at: {
                [db.Op.eq]: null
            },
        }
    }

    if (org_id) {
        permissions_where_obj.where.org_id = {
            [db.Op.or]: [0, org_id]
        };
    }


    var user_roles = await db.public.permissions.findAll(permissions_where_obj);
    var is_allowed = false;
    // return false;

    if(user_roles.length != 0){
        // we actually have roles

        // console.log("permission");
        if (user_roles.length == 1 && user_roles[0].entity_name == '*') {
            // Schema wildcard check
            if (user_roles[0].entity_name == '*' && (user_roles[0].role == role_level || user_roles[0].role == '*')) {
                console.log("Wildcard entry");
                console.log("allowed Using the permission ");
                console.log(JSON.stringify(user_roles[0], null, 4));
                //
                is_allowed = true;
            }
        } else {
            // Now, loop through all the permissions and check for existance or wild card entry
            for(var permission of user_roles){
                // entity wildcard check.
                if(permission.entity_id == 0 || permission.entity_id == entity_id){
                        if (permission.role == role_level || permission.role == '*') {
                            console.log("allowed Using the permission ");
                            console.log(JSON.stringify(permission, null, 4));
                            //
                            is_allowed = true;
                            role = permission.role;
                            break;
                        }
                        // else {
                        //     is_allowed = false;
                        //     // break;
                        // }
                }
            }
        }
    }

    if(is_allowed){
        console.log("Allowed for operations");
    } else {
        console.log("Not allowed for the operations");
    }
    return {
        success: is_allowed,
        role: role
    };
    // });
}

function main(){
    console.log("this is from main");
}

module.exports = {
    verifyRole: verifyRole
};
