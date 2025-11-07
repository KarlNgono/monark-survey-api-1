export default (sequelize, DataTypes) => {
    const Position = sequelize.define("Position", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        label: DataTypes.STRING,
    });

    Position.associate = (models) => {
        Position.belongsTo(models.Department, {
            foreignKey: "department_id",
            as: "department",
        });
        Position.hasMany(models.Contact, {
            foreignKey: "position_id",
            as: "contacts",
        });
    };

    return Position;
};
