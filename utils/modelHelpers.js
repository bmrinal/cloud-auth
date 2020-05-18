const { BadRequest } = require('../errors')

class ModelHelper {
    constructor() {
        this.validate = this.validate.bind(this)
    }

    validate(schema, options) {
        const { value, error } = schema.validate(options)
        if (error) throw new BadRequest(error)
        return value
    }
}
module.exports = new ModelHelper()
