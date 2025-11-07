export default (sequelize, DataTypes) => {
    return sequelize.define("Message", {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        contact_firstname: DataTypes.STRING,
        contact_type: DataTypes.STRING,
        contact_value: DataTypes.STRING,
        subject: DataTypes.STRING,
        body_html: DataTypes.TEXT,
        body_text: DataTypes.TEXT,
    });
};
