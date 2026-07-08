/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable("detail_fields", {
        id: "id",
        field_id: {
            type: "VARCHAR(10)",
            notNull: true,
            references: "fields",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        n: {
            type: "INTEGER",
            notNull: true,
        },
        p: {
            type: "INTEGER",
            notNull: true,
        },
        k: {
            type: "INTEGER",
            notNull: true,
        },
        temperature: {
            type: "FLOAT",
            notNull: true,
        },
        moisture: {
            type: "FLOAT",
            notNull: true,
        },
        ph: {
            type: "FLOAT",
            notNull: true,
        },
        salinity: {
            type: "FLOAT",
            notNull: true,
        },
        conductivity: {
            type: "FLOAT",
            notNull: true,
        },
        water_level: {
            type: "FLOAT",
            notNull: true,
        },
        soil_health: {
            type: "FLOAT",
            notNull: true,
        },
        created_at: {
            type: "TIMESTAMP",
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "TIMESTAMP",
            default: pgm.func("current_timestamp"),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("detail_fields");
};
