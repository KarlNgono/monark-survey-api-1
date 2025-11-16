export default (sequelize, DataTypes) => {
    const Segment = sequelize.define(
        "segment",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

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
                comment: "manual | dynamic"
            },

            filterRules: {
                type: DataTypes.JSON,
                comment: "Règles pour filtrer automatiquement les contacts si dynamic"
            },

            userId: {
                type: DataTypes.INTEGER
            },
        },
        {
            tableName: "segment",
            freezeTableName: true,
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
