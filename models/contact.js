export default (sequelize, DataTypes) => {
    const Contact = sequelize.define("Contact", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        contact_type: DataTypes.STRING,
        contact_value: DataTypes.STRING,
        birthdate: DataTypes.DATE,
        gender: DataTypes.STRING,
    });

    Contact.associate = (models) => {
        Contact.belongsTo(models.Language, {
            foreignKey: "language_id",
            as: "language",
        });

        Contact.belongsTo(models.Organization, {
            foreignKey: "organization_id",
            as: "organization",
        });

        Contact.belongsTo(models.Department, {
            foreignKey: "department_id",
            as: "department",
        });

        Contact.belongsTo(models.Position, {
            foreignKey: "position_id",
            as: "position",
        });

        Contact.belongsToMany(models.Segment, {
            through: models.ContactSegment,
            as: "segments",
            foreignKey: "contact_id",
            otherKey: "segment_id",
        });

    };

    return Contact;
};
