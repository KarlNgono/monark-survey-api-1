export default (sequelize, DataTypes) => {
    const Message = sequelize.define(
        "message",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            firstname: { type: DataTypes.STRING },
            type: { type: DataTypes.STRING },
            to: { type: DataTypes.STRING },
            subject: { type: DataTypes.STRING },
            body_html: { type: DataTypes.TEXT },
            body_text: { type: DataTypes.TEXT },
        },
        {
            tableName: "message",
            freezeTableName: true,
        }
    );

    Message.associate = (models) => {
        Message.hasMany(models.EventAttributes, {
            foreignKey: "message_id",
            as: "events",
        });
    };

    return Message;
};
