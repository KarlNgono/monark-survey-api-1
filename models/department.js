export default (sequelize, DataTypes) => {
    const Department = sequelize.define("Department", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        department_name: DataTypes.STRING,
    });

    Department.associate = (models) => {
        Department.belongsTo(models.Organization, {
            foreignKey: "organization_id",
            as: "organization",
        });
        Department.hasMany(models.Position, {
            foreignKey: "department_id",
            as: "positions",
        });
        Department.hasMany(models.Contact, {
            foreignKey: "department_id",
            as: "contacts",
        });
    };

    return Department;
};
