class Duplicate extends Error {
    constructor(message) {
        super()
        this.statusCode = 409
        this.message = message ? message : "Already exists"
    }
}
module.exports = Duplicate