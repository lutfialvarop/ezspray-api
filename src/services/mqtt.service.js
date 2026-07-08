const mqtt = require("mqtt");
const mqttConfig = require("../config/mqtt");
const { DetailField, WateringHistory, History } = require("../models");
const { sensorDataSchema, wateringStatusSchema } = require("../validations/mqtt.validation");
const logger = require("../utils/logger");

const WEIGHT = {
    ph: 0.25,
    moisture: 0.25,
    n: 0.15,
    p: 0.1,
    k: 0.15,
    ec: 0.1,
};

let mqttClient = null;

class MqttService {
    static score(value, min, max, tolerance) {
        if (value >= min && value <= max) return 100;

        if (value < min) {
            const diff = min - value;
            return Math.max(0, 100 - (diff / tolerance) * 100);
        }

        const diff = value - max;
        return Math.max(0, 100 - (diff / tolerance) * 100);
    }

    static calculateSoilHealth(sensorData) {
        const phScore = score(sensorData.ph, 5.8, 6.8, 1.0);

        const moistureScore = score(sensorData.moisture, 55, 70, 30);

        const nScore = score(sensorData.n, 30, 60, 30);

        const pScore = score(sensorData.p, 10, 20, 10);

        const kScore = score(sensorData.k, 150, 220, 80);

        const ecScore = score(sensorData.conductivity, 1.2, 2.2, 1.0);

        const soilHealth = phScore * WEIGHT.ph + moistureScore * WEIGHT.moisture + nScore * WEIGHT.n + pScore * WEIGHT.p + kScore * WEIGHT.k + ecScore * WEIGHT.ec;

        return Math.round(soilHealth * 100) / 100;
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
