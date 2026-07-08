/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable("users", {
        id: "id",
        name: {
            type: "VARCHAR(255)",
            notNull: true,
        },
        email: {
            type: "VARCHAR(255)",
            notNull: true,
            unique: true,
        },
        password: {
            type: "TEXT",
            notNull: false,
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
    pgm.dropTable("users");
};
