/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable("fields", {
        id: {
            type: "VARCHAR(10)",
            primaryKey: true,
        },
        name: {
            type: "VARCHAR(255)",
            notNull: true,
        },
        user_id: {
            type: "INTEGER",
            notNull: true,
            references: "users",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
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
    pgm.dropTable("fields");
};
