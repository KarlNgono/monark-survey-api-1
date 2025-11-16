export default (sequelize, DataTypes) => {
    const UsedToken = sequelize.define("usedTokens", {
            tokenHash: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            usedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: "usedTokens",
            freezeTableName: true,
        });
    return UsedToken;
};
