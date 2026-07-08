const Joi = require("joi");

const sensorDataSchema = Joi.object({
    n: Joi.number().allow(null).optional(),
    p: Joi.number().allow(null).optional(),
    k: Joi.number().allow(null).optional(),
    temperature: Joi.number().allow(null).optional(),
    moisture: Joi.number().allow(null).optional(),
    ph: Joi.number().allow(null).optional(),
    salinity: Joi.number().allow(null).optional(),
    conductivity: Joi.number().allow(null).optional(),
    water_level: Joi.number().allow(null).optional(),
    rtc_time: Joi.string().allow(null).optional(),
});

const wateringStatusSchema = Joi.object({
    water: Joi.number().allow(null).optional(),
    npk: Joi.number().allow(null).optional(),
    acid: Joi.number().allow(null).optional(),
    base: Joi.number().allow(null).optional(),
});

module.exports = {
    sensorDataSchema,
    wateringStatusSchema,
};
