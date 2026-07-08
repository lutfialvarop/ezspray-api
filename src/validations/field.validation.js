const Joi = require("joi");

const createFieldSchema = Joi.object({
    field_id: Joi.string().required().max(10).min(10).messages({
        "string.empty": "field_id tidak boleh kosong",
        "any.required": "field_id wajib diisi",
    }),
    user_id: Joi.number().integer().required().messages({
        "number.base": "user_id harus berupa angka",
        "any.required": "user_id wajib diisi",
    }),
});

const controlCommandSchema = Joi.object({
    field_id: Joi.string().required().messages({
        "string.empty": "field_id tidak boleh kosong",
        "any.required": "field_id wajib diisi",
    }),
    user_id: Joi.number().integer().required().messages({
        "number.base": "user_id harus berupa angka",
        "any.required": "user_id wajib diisi",
    }),
});

const historyQuerySchema = Joi.object({
    user_id: Joi.number().required(),
    currentdate: Joi.string()
        .pattern(/^\d{2}-\d{2}-\d{4}$/)
        .optional()
        .messages({
            "string.pattern.base": "Format currentdate harus DD-MM-YYYY",
        }),
});

module.exports = {
    createFieldSchema,
    controlCommandSchema,
    historyQuerySchema,
};
