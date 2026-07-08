const mqtt = require("mqtt");
const mqttConfig = require("../config/mqtt");
const { DetailField, WateringHistory, History } = require("../models");
const { sensorDataSchema, wateringStatusSchema } = require("../validations/mqtt.validation");
const logger = require("../utils/logger");

const OPTIMAL = {
    ph: 6.2,
    moisture: 67,
    n: 40,
    p: 15,
    k: 180,
    ec: 1.8,
};

let mqttClient = null;

class MqttService {
    static calculateSoilHealth(sensorData) {
        const { ph, moisture, n, p, k, conductivity } = sensorData;

        const phDiff = Math.abs(ph - OPTIMAL.ph) / OPTIMAL.ph;
        const moistureDiff = Math.abs(moisture - OPTIMAL.moisture) / OPTIMAL.moisture;
        const nDiff = Math.abs(n - OPTIMAL.n) / OPTIMAL.n;
        const pDiff = Math.abs(p - OPTIMAL.p) / OPTIMAL.p;
        const kDiff = Math.abs(k - OPTIMAL.k) / OPTIMAL.k;
        const ecDiff = Math.abs(conductivity - OPTIMAL.ec) / OPTIMAL.ec;

        const totalDiff = phDiff + moistureDiff + nDiff + pDiff + kDiff + ecDiff;
        const soilHealth = Math.round((1 - totalDiff / 6) * 10000) / 100;

        return Math.max(0, Math.min(100, soilHealth));
    }

    connect() {
        mqttClient = mqtt.connect(mqttConfig.brokerUrl, mqttConfig.options);

        mqttClient.on("connect", () => {
            logger.info("Terhubung ke MQTT Broker:", mqttConfig.brokerUrl);

            mqttClient.subscribe(mqttConfig.topics.data, (err) => {
                if (!err) logger.info(`Subscribed ke topik: ${mqttConfig.topics.data}`);
            });

            mqttClient.subscribe(mqttConfig.topics.status, (err) => {
                if (!err) logger.info(`Subscribed ke topik: ${mqttConfig.topics.status}`);
            });
        });

        mqttClient.on("error", (err) => {
            logger.error("MQTT Error:", err.message);
        });

        mqttClient.on("reconnect", () => {
            logger.info("Mencoba reconnect ke MQTT Broker...");
        });

        mqttClient.on("message", (topic, message) => {
            this.handleMessage(topic, message.toString());
        });
    }

    async handleMessage(topic, rawMessage) {
        try {
            const topicParts = topic.split("/");
            const fieldId = topicParts[1];
            const messageType = topicParts[2];

            let payload;
            try {
                payload = JSON.parse(rawMessage);
            } catch {
                logger.warn(`Payload bukan JSON valid dari topik: ${topic}`);
                return;
            }

            if (messageType === "data") {
                await this.handleSensorData(fieldId, payload);
            } else if (messageType === "status") {
                await this.handleWateringStatus(fieldId, payload);
            }
        } catch (error) {
            logger.error("Error menangani pesan MQTT:", error.message);
        }
    }

    async handleSensorData(fieldId, payload) {
        const { error, value } = sensorDataSchema.validate(payload, { stripUnknown: true });

        if (error) {
            logger.warn(`Validasi sensor data gagal untuk ${fieldId}:`, error.details[0].message);
            return;
        }

        const soil_health = MqttService.calculateSoilHealth(value);

        await DetailField.create({
            field_id: fieldId,
            ...value,
            soil_health,
        });

        logger.info(`Sensor data tersimpan untuk field_id: ${fieldId}`);
    }

    async handleWateringStatus(fieldId, payload) {
        const { error, value } = wateringStatusSchema.validate(payload, { stripUnknown: true });

        if (error) {
            logger.warn(`Validasi watering status gagal untuk ${fieldId}:`, error.details[0].message);
            return;
        }

        await History.create({
            field_id: fieldId,
            ...value,
        });

        logger.info(`Watering history tersimpan untuk field_id: ${fieldId}`);
    }

    publish(topic, message) {
        if (!mqttClient || !mqttClient.connected) {
            logger.error("MQTT Client tidak terhubung, tidak bisa publish");
            throw new Error("MQTT Client tidak terhubung");
        }

        mqttClient.publish(topic, message, { qos: 1 }, (err) => {
            if (err) {
                logger.error(`Gagal publish ke topik ${topic}:`, err.message);
            } else {
                logger.info(`Pesan terkirim ke topik: ${topic}`);
            }
        });
    }

    getClient() {
        return mqttClient;
    }
}

module.exports = new MqttService();
