require("dotenv").config();

const logger = require("./src/utils/logger.js");
const app = require("./src/app.js");
const mqttService = require("./src/services/mqtt.service");

const port = process.env.PORT || 3000;

const startServer = () => {
    try {
        mqttService.connect();

        app.listen(port, () => {
            logger.info("Server Running");
            logger.info(`Server URL: http://localhost:${port}`);
            logger.info("Port Server:", port);
        });
    } catch (error) {
        logger.error("Server Error:", error);
        process.exit(1);
    }
};

const gracefulShutdown = (signal) => {
    console.log(`Melakukan shutdown...`);

    const mqttClient = mqttService.getClient();
    if (mqttClient) {
        mqttClient.end(true, () => {
            console.log("Koneksi MQTT ditutup.");
        });
    }

    process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();
