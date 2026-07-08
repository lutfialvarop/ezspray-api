/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable("histories", {
        id: "id",
        field_id: {
            type: "VARCHAR(10)",
            notNull: true,
            references: "fields",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        water: {
            type: "FLOAT",
            notNull: true,
        },
        npk: {
            type: "FLOAT",
            notNull: true,
        },
        base: {
            type: "FLOAT",
            notNull: true,
        },
        acid: {
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
    pgm.dropTable("histories");
};
