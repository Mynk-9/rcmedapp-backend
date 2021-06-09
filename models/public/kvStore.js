
module.exports = (sequelize, DataTypes) => {
    const kv = sequelize.define('kv', {
        
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        login_id: { type:DataTypes.BIGINT },

        key: { type: DataTypes.TEXT, allowNull: false },
        value: { type: DataTypes.TEXT, allowNull: false },


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

    kv.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return kv;
};
