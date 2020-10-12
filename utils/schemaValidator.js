const { BadRequest } = require('../errors')

module.exports = (schema, options) => {
    const { value, error } = schema.validate(options)
    if (error) throw new BadRequest(error)
    return value
}