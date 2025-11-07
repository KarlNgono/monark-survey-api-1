export default (sequelize, DataTypes) => {
    const Language = sequelize.define("Language", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        language_name: DataTypes.STRING,
        code_iso2: DataTypes.STRING,
        code_iso4: DataTypes.STRING,
    });

    Language.associate = (models) => {
        Language.hasMany(models.Contact, {
            foreignKey: "language_id",
            as: "contacts",
        });
    };

    return Language;
};
