const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Field = sequelize.define(
        "Field",
        {
            id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "fields",
        },
    );

    return Field;
};
