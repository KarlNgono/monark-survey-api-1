export default (sequelize, DataTypes) => {
    const EventAttributes = sequelize.define(
        "eventAttributes",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            response_submitted: { type: DataTypes.BOOLEAN, defaultValue: false },
            opened: { type: DataTypes.BOOLEAN, defaultValue: false },
            clicked: { type: DataTypes.BOOLEAN, defaultValue: false },
            bounced: { type: DataTypes.BOOLEAN, defaultValue: false },
            pending: { type: DataTypes.BOOLEAN, defaultValue: true },
        },
        {
            tableName: "eventAttributes",
        }
    );

    EventAttributes.associate = (models) => {
        EventAttributes.belongsTo(models.Message, {
            foreignKey: "message_id",
            as: "message",
        });
    };

    return EventAttributes;
};
