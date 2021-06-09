var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const policy = sequelize.define('policy', {
        
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        login_id: { type:DataTypes.BIGINT },
        // In case the user dosent exist
        name: { type:DataTypes.TEXT }, // The public facing name
        org_id: { type:DataTypes.BIGINT },
        created_by_id: { type:DataTypes.BIGINT },

        type: { type:DataTypes.TEXT },
        /**
         * Type has 2 values:
         *      - iam_role : this is the iam role for the user
         *      - db_entity : This is the entity that is available and its heirichy(for other checks)
         */


        entity_name: { type: DataTypes.TEXT, allowNull: false },
        /**
         * WILDCARD: *
         * Recorded as: schemaName.tableName
         * If the entity name is *, then he has access to all the entities.
         * If the entity name corresponds to an entity name in the db, then based on the role, the access is allotted
         */


        roles: { type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.TEXT)), allowNull: false },
        
        /**
         *  The general format of roles is an array 
         * 
         * [resource_name, role, resource_id_key]
         * 
         * resource_id_key is the variable name in the JSON, 
         */
        other_data: { type: DataTypes.JSONB },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE
    }, {
            underscored: true
        });

    policy.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return policy;
};
