export default (sequelize, DataTypes) => {
    const MessageTemplate = sequelize.define("MessageTemplate", {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: DataTypes.STRING,
        subject: DataTypes.STRING,
        content_html: DataTypes.TEXT,
        content_text: DataTypes.TEXT,
        language_code: {
            type: DataTypes.STRING(2),
            allowNull: false,
            defaultValue: "fr"
        }
    });

    return MessageTemplate;
};
