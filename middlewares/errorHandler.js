module.exports = (err, req, res, next) => {
    const { statusCode = 500, message } = err
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    })
    next()
} 