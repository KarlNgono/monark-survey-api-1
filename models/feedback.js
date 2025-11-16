export default (sequelize, DataTypes) => {
    const Feedback = sequelize.define(
        "feedback",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            screenshot: {
                type: DataTypes.BLOB,
                allowNull: true
            }
        },
        {
            tableName: "feedback",
            freezeTableName: true
        }
    );

    return Feedback;
};
