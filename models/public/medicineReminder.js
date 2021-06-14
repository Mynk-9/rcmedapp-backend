module.exports = (sequelize, DataTypes) => {
  const medicineReminder = sequelize.define(
    "medicineReminder",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      medicine_name: { type: DataTypes.TEXT },
      medicine_type: { type: DataTypes.TEXT },
      timing: { type: DataTypes.DATE },
      duration: { type: DataTypes.TEXT },
      dosage: { type: DataTypes.TEXT },
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

  return medicineReminder;
};
