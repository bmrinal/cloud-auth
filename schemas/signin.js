const Joi = require('@hapi/joi')
module.exports = Joi.object({
    password: Joi.string().required().min(4),
    email: Joi.string().email().when('username', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
    username: Joi.string()
})