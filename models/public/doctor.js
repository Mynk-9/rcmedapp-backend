module.exports = (sequelize, DataTypes) => {
  const doctor = sequelize.define(
    "doctor",
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
      bio: { type: DataTypes.TEXT },
      sex: { type: DataTypes.INTEGER },
      address: { type: DataTypes.JSONB },
      city: { type: DataTypes.TEXT },
      primary_practice: { type: DataTypes.TEXT },
      secondary_practice: { type: DataTypes.TEXT },
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

  return doctor;
};
