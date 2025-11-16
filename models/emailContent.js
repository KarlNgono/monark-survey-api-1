export default (sequelize, DataTypes) => {
    const EmailContent = sequelize.define(
        "emailContent",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            content_text: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            content_html: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            emailTemplateId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            languageId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "emailContent",
            freezeTableName: true,
        }
    );

    EmailContent.associate = (models) => {

        EmailContent.belongsTo(models.EmailTemplate, {
            foreignKey: "emailTemplateId",
            as: "template"
        });

        EmailContent.belongsTo(models.Language, {
            foreignKey: "languageId",
            as: "language"
        });
    };

    return EmailContent;
};
