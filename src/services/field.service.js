const { Op } = require("sequelize");
const { Field, DetailField, History } = require("../models");
const mqttService = require("./mqtt.service");

class FieldService {
    async getAllFields(userId) {
        const fields = await Field.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: DetailField,
                    as: "detail_fields",
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                    separate: true,
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return fields;
    }

    async getWateringHistory(userId, currentDate = null) {
        const fields = await Field.findAll({
            where: { user_id: userId },
            attributes: ["id"],
        });

        const machineIds = fields.map((field) => Field.id);

        if (machineIds.length === 0) {
            return [];
        }

        let dateFilter = {};

        if (currentDate) {
            const [day, month, year] = currentDate.split("-").map(Number);
            const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
            const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            };
        } else {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            dateFilter = {
                createdAt: {
                    [Op.gte]: sevenDaysAgo,
                },
            };
        }

        const history = await History.findAll({
            include: [
                {
                    model: Field,
                    as: "field",
                    where: {
                        user_id: userId,
                    },
                    attributes: [],
                },
            ],
            where: dateFilter,
            order: [["createdAt", "DESC"]],
        });

        return history;
    }

    async createField(fieldId, userId) {
        const existingField = await Field.findOne({
            where: { id: fieldId },
        });

        if (existingField) {
            throw new Error(`field_id "${fieldId}" sudah terdaftar pada sistem`);
        }

        const newField = await Field.create({
            id: fieldId,
            name: "Kebun C",
            user_id: userId,
        });

        return newField;
    }

    async getFieldDetail(fieldId, userId) {
        const field = await Field.findOne({
            where: {
                id: fieldId,
                user_id: userId,
            },
            include: [
                {
                    model: DetailField,
                    as: "detail_fields",
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                    separate: true,
                },
            ],
        });

        return field;
    }

    async sendControlCommand(fieldId, userId, command) {
        const field = await Field.findOne({
            where: {
                id: fieldId,
                user_id: userId,
            },
        });

        if (!field) {
            throw new Error(`Field dengan field_id "${fieldId}" tidak ditemukan atau bukan milik Anda`);
        }

        const topic = `ezspray/${fieldId}/control`;
        mqttService.publish(topic, JSON.stringify(command));

        return {
            topic,
            command,
            message: `Perintah berhasil dikirim ke ${fieldId}`,
        };
    }
}

module.exports = new FieldService();
