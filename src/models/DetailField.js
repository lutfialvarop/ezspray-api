const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const DetailField = sequelize.define(
        "DetailField",
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
            n: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            p: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            k: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            temperature: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            moisture: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            ph: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            salinity: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            conductivity: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            water_level: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            soil_health: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            tableName: "detail_fields",
        },
    );

    return DetailField;
};
