const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const response = require("./utils/apiResponse");
const fieldRoutes = require("./routes/field.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
    response.success(
        res,
        {
            version: "1.0.0",
            uptime: process.uptime(),
        },
        "Back-End EzSpray API is running",
    );
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/myfield", fieldRoutes);

app.use((req, res) => {
    response.error(res, `Route ${req.method} ${req.originalUrl} tidak ditemukan`, 404);
});

app.use((err, req, res, next) => {
    logger.error("Global Error:", err.stack);
    response.error(res, "Terjadi kesalahan internal server", 500);
});

module.exports = app;
