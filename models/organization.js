export default (sequelize, DataTypes) => {
    const Organization = sequelize.define(
        "organization",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            industry: {
                type: DataTypes.STRING,
            },

            type: {
                type: DataTypes.STRING,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            team: {
                type: DataTypes.STRING,
            },

            region: {
                type: DataTypes.STRING
            },

            city: {
                type: DataTypes.STRING
            },

            userId: {
                type: DataTypes.INTEGER,
            },

        },
        {
            tableName: "organization",
            freezeTableName: true,
        }
    );

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
