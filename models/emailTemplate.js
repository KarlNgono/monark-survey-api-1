export default (sequelize, DataTypes) => {
    const EmailTemplate = sequelize.define("emailTemplate", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true, autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content_html: DataTypes.TEXT,
        },
        {
            tableName: "emailTemplate",
            freezeTableName: true
        }
    );

    EmailTemplate.associate = models => {
        EmailTemplate.hasMany(models.EmailContent, {
            foreignKey: "emailTemplateId",
            as: "contents"
        });
    };

    return EmailTemplate;
};
