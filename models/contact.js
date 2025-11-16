export default (sequelize, DataTypes) => {
    const Contact = sequelize.define(
        "contact",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },

            lastname: {
                type: DataTypes.STRING
            },

            type: {
                type: DataTypes.STRING,
                comment: "email | phone | whatsapp | etc."
            },

            value: {
                type: DataTypes.STRING,
                comment: "email or phone number"
            },

            birthdate: {
                type: DataTypes.DATE
            },

            gender: {
                type: DataTypes.STRING
            },

            position: {
                type: DataTypes.STRING,
                comment: "Job title"
            },

            userId: {
                type: DataTypes.INTEGER,
                comment: "ID du user qui a créé le contact"
            },
        },
        {
            tableName: "contact",
            freezeTableName: true,
        }
    );

    Contact.associate = models => {

        Contact.belongsTo(models.Language, {
            foreignKey: "language_id",
            as: "language"
        });

        Contact.belongsTo(models.Department, {
            foreignKey: "department_id",
            as: "department"
        });

        Contact.belongsTo(models.Organization, {
            foreignKey: "organization_id",
            as: "organization"
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
