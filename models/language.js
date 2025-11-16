export default (sequelize, DataTypes) => {
    const Language = sequelize.define(
        "language",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: "Nom complet de la langue (ex: Français)"
            },

            languageCode: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: "Code ISO (ex: fr, en)"
            },

            userId: {
                type: DataTypes.INTEGER
            }
        },
        {
            tableName: "language",
            freezeTableName: true
        }
    );

    Language.associate = models => {
        Language.hasMany(models.EmailContent, {
            foreignKey: "languageId",
            as: "emailContents"
        });

        Language.hasMany(models.Contact, {
            foreignKey: "language_id",
            as: "contacts"
        });

    };

    return Language;
};
