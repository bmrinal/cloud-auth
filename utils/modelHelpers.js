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
    removeNulls(objectToFilter) {
        let sanitizedObject = {}
        Object.entries(objectToFilter).forEach(([key, value]) => {
            if (value) {
                sanitizedObject[key] = value
            }
        })
        return sanitizedObject
    }
}
module.exports = new ModelHelper()
