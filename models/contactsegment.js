export default (sequelize, DataTypes) => {
    return sequelize.define(
        "ContactSegment",
        {
            contact_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "contacts", key: "id" } },
            segment_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "segments", key: "id" } },
        },
        { tableName: "contact_segments", timestamps: false }
    );
};
