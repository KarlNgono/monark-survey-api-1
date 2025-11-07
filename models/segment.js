export default (sequelize, DataTypes) => {
    const Segment = sequelize.define(
        "Segment",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            filter_rules: {
                type: DataTypes.JSON,
            },
        },
        {
            tableName: "segments",
            timestamps: true,
        }
    );

    Segment.associate = (models) => {
        Segment.belongsToMany(models.Contact, {
            through: models.ContactSegment,
            as: "contacts",
            foreignKey: "segment_id",
            otherKey: "contact_id",
        });
    };


    return Segment;
};
