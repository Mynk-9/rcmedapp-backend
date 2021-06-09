// This is for reference only. Not to be used anywhere
var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var userFunc = require("../functions/userFunc");

var user_credentials = {
    id: 1
};

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
                })
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

    if(req.query.id){
        user_credentials.id = req.query.id;
    }

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

        var redis = new db.cache(config.db.cache);
        // Now, create this slit
        var cache_strips = await redis.lrange('ctrl_flight_' + user_credentials.id, 0, -1);
        // 0, -1 gets all the data but you can include pagniation as well
        var strips = [], db_strips, i, is_discrepency=false, discrepencies = {};

        if(!cache_strips.length){
            // This means that the strips are not in the cache or the user does not have any flights. cross check this with the DB
            console.log("There are no strips in the cache, checking the db");
            db_strips = await db.atc.strips.findAll({
                where: {
                    login_id: user_credentials.id
                }
            });

            if(db_strips.length == cache_strips.length){
                // This means there is nothing there in the db for this guy
                console.log("There are actually no strips");
                strips = [];
            } else {
                // Now, there is a mismatch. Populate this in the cache.
                console.log("There is a discrepency");
                strips = db_strips;
            }
        } else {
            // This means, that there is data in the strips. Time to acquire them and push it to the frontend.
            console.log("There are strips in the cache, not touching the db");
            db_strips = cache_strips;
            var flight = {};
            for(i of cache_strips){
                flight = await redis.get('flight_' + i);
                // Now, if the flight does not exist, then query it from the db

                if(!flight){
                    flight = await db.atc.strips.findOne({
                        where: {
                            id: i
                        }
                    });

                    is_discrepency = true;
                    discrepencies['flight_' + i] = flight;
                    strips.push(flight);
                } else {
                    strips.push(JSON.parse(flight));
                }
            }
            // In reality, there should be a timestamp check, to see if the data is new or old
        }

        res.status(200).json({
            success: true,
            strips: strips,
            count: strips.length
        });
        // Now that the response is sent, now it is time to make sure that the cache is updated. 
        
        if(cache_strips.length != db_strips.length){
            // Time to update the cache. The reason as to why we have this in the controller level is because the mechanism for each cache module is different, and instead of writing different functions, I think it is better to use the controller to populate the data accordingly. 
            strips = [];
            var flight_set, atc_set, key = 'ctrl_flight_' + user_credentials.id;
            for(i of db_strips){
                flight_set = await redis.set('flight_' + i.id, JSON.stringify(i));
                if(flight_set == 'OK'){
                    console.log("The flight set is success");
                    strips.push(i.id);
                } else {
                    console.log("There is an issue with flight_set:  flight_" + i.id);
                }
            }

            atc_set = await redis.del(key);
            atc_set =  await redis.rpush(key, strips);
            console.log("The atc set is");
            console.log(atc_set);
        }
        // now, clear the discrepencies
        if (is_discrepency) {
            for (i in discrepencies) {
                console.log(i);
                flight_set = await redis.set(i, JSON.stringify(discrepencies[i]));
                if (flight_set == 'OK') {
                    console.log("The flight set is success");
                } else {
                    console.log("There is an issue with flight_set:  flight_" + i.id);
                }

            }
        }

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