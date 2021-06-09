var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const permissions = sequelize.define('permissions', {
        
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        login_id: { type:DataTypes.BIGINT },
        // In case the user dosent exist
        email: { type:DataTypes.TEXT },
        mobile: { type:DataTypes.TEXT },

        org_id: { type:DataTypes.BIGINT },
        created_by_id: { type:DataTypes.BIGINT },
        role: { type: DataTypes.TEXT, allowNull: false },

        policy_id: { type:DataTypes.BIGINT }, // The id of the policy from which it was created

        /**
         * role can take 3 values:
         *          - * : all permissions(all api calls)
         *          - r : only reads
         *          - w : only writes
         */

        entity_name: { type: DataTypes.TEXT, allowNull: false },
        /**
         * WILDCARD: *
         * Recorded as: schemaName.tableName
         * If the entity name is *, then he has access to all the entities.
         * If the entity name corresponds to an entity name in the db, then based on the role, the access is allotted
         */
        entity_id: { type: DataTypes.BIGINT, allowNull: false },
        /**
         *  WILDCARD: 0
         * If the entity id is 0, then he has access to all the records of that entity, based on the role.
         * else, as usual, check the role
         */

        status: { type:DataTypes.DATE },

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

    permissions.addHook('afterCreate', 'preOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return permissions;
};

/**
 * Cache architecture:
 *      userId_entityName_role : [entityId]
 *      userId_entityName_entityId_role : true // New design
 */
