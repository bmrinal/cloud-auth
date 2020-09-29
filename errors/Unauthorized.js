class Unauthorized extends Error {
    constructor(message) {
        super()
        this.statusCode = 401
        this.message = message ? message : "The user is not authorized"
    }
}
module.exports = Unauthorized