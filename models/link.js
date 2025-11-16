export default (sequelize, DataTypes) => {
    return sequelize.define("link", {
            id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
            code: {type: DataTypes.STRING, unique: true, allowNull: false},
            surveyId: {type: DataTypes.STRING, allowNull: false},
            contactId: {type: DataTypes.INTEGER},
            type: {
                type: DataTypes.ENUM("general", "private"),
                allowNull: false,
                defaultValue: "general"
            },
            maxUses: {type: DataTypes.INTEGER, defaultValue: 1},
            uses: {type: DataTypes.INTEGER, defaultValue: 0},
            expiresAt: {type: DataTypes.DATE, allowNull: true},
            closeOnSubmit: {type: DataTypes.BOOLEAN, defaultValue: true},
            isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
        },
        {
            tableName: "link",
            freezeTableName:
                true
        }
    )
        ;
}
;
