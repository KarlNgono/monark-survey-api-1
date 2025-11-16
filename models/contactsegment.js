export default (sequelize, DataTypes) => {
    return sequelize.define(
        "contactSegment",
        {
            contact_id: { type: DataTypes.INTEGER, primaryKey: true },
            segment_id: { type: DataTypes.INTEGER, primaryKey: true },
        },
        {
            tableName: "contactSegment",
            freezeTableName: true
        }
    );
};
