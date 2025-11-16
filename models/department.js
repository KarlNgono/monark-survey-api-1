export default (sequelize, DataTypes) => {
    const Department = sequelize.define(
        "department",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: "department",
            freezeTableName: true
        }
    );

    Department.associate = (models) => {

        Department.belongsTo(models.Organization, {
            foreignKey: "organization_id",
            as: "organization",
        });

        Department.hasMany(models.Contact, {
            foreignKey: "department_id",
            as: "contacts",
        });
    };

    return Department;
};
