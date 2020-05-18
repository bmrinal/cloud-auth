const Joi = require('@hapi/joi')
const { validate } = require('../utils/modelHelpers')
const schema = Joi.object({
    username: Joi.string(),
    password: Joi.string().required().min(7).alphanum(),
    email: Joi.string().required().email(),
    roles: Joi.array().default([]),
    firstName: Joi.string(),
    lastName: Joi.string(),
    contactNumber: Joi.string().regex(/^(\(\d{3}\) |\d{3}-)\d{3}-\d{4}$/),
    designation: Joi.string()
})

class UserModel {
    constructor(options) {
        const {
            username,
            password,
            email,
            roles,
            firstName,
            lastName,
            contactNumber,
            designation
        } = validate(schema, options)

        this.username = username
        this.password = password
        this.email = email
        this.roles = roles
        this.firstName = firstName
        this.lastName = lastName
        this.contactNumber = contactNumber
        this.designation = designation
    }
    get data() {
        const { username, email, roles, firstName, lastName, contactNumber, designation, _id: id } = this
        return {
            username,
            email,
            roles,
            firstName,
            lastName,
            contactNumber,
            designation,
            id
        }
    }
}
module.exports = UserModel