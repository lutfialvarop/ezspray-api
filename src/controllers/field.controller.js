const fieldService = require("../services/field.service");
const response = require("../utils/apiResponse");
const { createFieldSchema, controlCommandSchema, historyQuerySchema } = require("../validations/field.validation");
const logger = require("../utils/logger");

class FieldController {
    async getAllFields(req, res) {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return response.error(res, "Body user_id wajib diisi", 400);
            }

            const fields = await fieldService.getAllFields(Number(user_id));
            return response.success(res, "Data Field berhasil diambil", fields);
        } catch (error) {
            logger.error("Error getAllFields:", error.message);
            return response.error(res, "Gagal mengambil data Field", 500);
        }
    }

    async getWateringHistory(req, res) {
        try {
            const { user_id } = req.body;
            const { currentdate } = req.query;

            const { error, value } = historyQuerySchema.validate({ user_id, currentdate });

            if (error) {
                return response.error(res, "Terjadi kesalahan pada input", error.details);
            }

            const history = await fieldService.getWateringHistory(Number(value.user_id), value.currentdate || null);

            return response.success(res, "Riwayat penyiraman berhasil diambil", history);
        } catch (error) {
            logger.error("Error getWateringHistory:", error.message);
            return response.error(res, "Gagal mengambil riwayat penyiraman", 500);
        }
    }

    async createField(req, res) {
        try {
            const { error, value } = createFieldSchema.validate(req.body);

            if (error) {
                return response.error(res, "Terjadi kesalahan pada input", error.details);
            }

            const newField = await fieldService.createField(value.field_id, value.user_id);

            return response.success(res, "Field berhasil ditambahkan", newField, 201);
        } catch (error) {
            logger.error("Error createField:", error.message);

            if (error.message.includes("sudah terdaftar")) {
                return response.error(res, error.message, 409);
            }

            return response.error(res, "Gagal menambahkan Field", 500);
        }
    }

    async getFieldDetail(req, res) {
        try {
            const { field_id } = req.params;
            const { user_id } = req.body;

            if (!user_id) {
                return response.error(res, "Parameter user_id wajib diisi", 400);
            }

            const field = await fieldService.getFieldDetail(field_id, Number(user_id));

            if (!field) {
                return response.error(res, "Field tidak ditemukan atau Anda tidak memiliki akses", 404);
            }

            return response.success(res, "Detail Field berhasil diambil", field);
        } catch (error) {
            logger.error("Error getFieldDetail:", error.message);
            return response.error(res, "Gagal mengambil detail Field", 500);
        }
    }

    async sendControlCommand(req, res) {
        try {
            const { error, value } = controlCommandSchema.validate(req.body);

            if (error) {
                return response.error(res, "Terjadi kesalahan pada input", error.details);
            }

            const result = await fieldService.sendControlCommand(value.field_id, value.user_id, "{'watering' = 'on'}");

            return response.success(res, "Perintah kontrol berhasil dikirim", result);
        } catch (error) {
            logger.error("Error sendControlCommand:", error.message);

            if (error.message.includes("tidak ditemukan")) {
                return response.error(res, error.message, 404);
            }

            if (error.message.includes("MQTT")) {
                return response.error(res, "Layanan MQTT tidak tersedia", 503);
            }

            return response.error(res, "Gagal mengirim perintah kontrol", 500);
        }
    }
}

module.exports = new FieldController();
