const { Unauthorized } = require("../errors")
const { redis } = require('../db')

module.exports = async (req, res, next) => {
    const { token } = req.query || req.body || req.headers
    if (!token) {
        throw new Unauthorized('Authentication token required')
    }
    let user = await redis.get(token)
    if (user) {
        user = JSON.parse(user)
        req.authenticated = true
        req.email = user.email
        next()
    }
    else {
        throw new Unauthorized('Invalid authentication token')
    }
}