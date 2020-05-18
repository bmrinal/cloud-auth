class NotFound extends Error {
    constructor(message) {
        super()
        this.statusCode = 404
        this.message = message ? message : "Not Found"
    }
}
module.exports = NotFound