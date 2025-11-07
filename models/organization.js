export default (sequelize, DataTypes) => {
    const Organization = sequelize.define("Organization", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        industry: DataTypes.STRING,
        organization_type: DataTypes.STRING,
        organization_name: DataTypes.STRING,
        team: DataTypes.STRING,
        region: DataTypes.STRING,
        city: DataTypes.STRING,
    });

    Organization.associate = (models) => {
        Organization.hasMany(models.Department, {
            foreignKey: "organization_id",
            as: "departments",
        });
        Organization.hasMany(models.Contact, {
            foreignKey: "organization_id",
            as: "contacts",
        });
    };

    return Organization;
};
