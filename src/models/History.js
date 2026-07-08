const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const History = sequelize.define(
        "History",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            field_id: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            water: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            npk: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            base: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            acid: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            tableName: "histories",
        },
    );

    return History;
};
