require("dotenv").config();

const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");
const logger = require("../utils/logger");

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    define: config.define,
    pool: config.pool || {},
});

const Field = require("./Field")(sequelize);
const DetailField = require("./DetailField")(sequelize);
const History = require("./History")(sequelize);

Field.hasMany(DetailField, {
    foreignKey: "field_id",
    as: "detail_fields",
});

DetailField.belongsTo(Field, {
    foreignKey: "field_id",
    as: "field",
});

Field.hasMany(History, {
    foreignKey: "field_id",
    as: "histories",
});

History.belongsTo(Field, {
    foreignKey: "field_id",
    as: "field",
});

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Koneksi database berhasil.");

        if (env === "development") {
            await sequelize.sync({ alter: true });
            logger.info("Semua tabel berhasil disinkronkan.");
        }
    } catch (error) {
        logger.error("Gagal sinkronisasi database:", error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    Field,
    DetailField,
    History,
    syncDatabase,
};
