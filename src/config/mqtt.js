require("dotenv").config();

module.exports = {
    brokerUrl: process.env.MQTT_BROKER || "mqtt://broker.emqx.io:1883",
    options: {
        username: process.env.MQTT_USERNAME || "",
        password: process.env.MQTT_PASSWORD || "",
        clientId: `ezspray_backend_${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 30 * 1000,
    },
    topics: {
        data: "ezspray/+/data",
        status: "ezspray/+/status",
    },
};
