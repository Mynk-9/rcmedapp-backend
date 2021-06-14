module.exports = (sequelize, DataTypes) => {
  const login = sequelize.define(
    "login",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      firebase_id: { type: DataTypes.TEXT },
      name: { type: DataTypes.TEXT },
      age: { type: DataTypes.INTEGER },
      email: { type: DataTypes.TEXT },
      mobile: { type: DataTypes.TEXT },
      new_user: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sex: { type: DataTypes.TEXT },
      address: { type: DataTypes.JSONB },
      city: { type: DataTypes.TEXT },
      total_profile: { type: DataTypes.INTEGER },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      underscored: true,
    }
  );

  return login;
};
