class ModelHelper {
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
