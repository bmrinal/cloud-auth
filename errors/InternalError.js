class InternalError extends Error {
    constructor(message) {
        super()
        this.statusCode = 503
        this.message = message ? message : "Internal Server Error"
    }
}
module.exports = InternalError