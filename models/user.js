const Joi = require('@hapi/joi')
const { v4: uuidv4 } = require('uuid')
const { removeNulls } = require('../utils/modelHelpers')
const schemaValidator = require('../utils/schemaValidator')
ObjectID = require('mongodb').ObjectID

const schema = Joi.object({
    _id: Joi.optional(),
    username: Joi.string().allow(null),
    password: Joi.string().required().min(4),
    email: Joi.string().required().email(),
    roles: Joi.array().default([]),
    firstName: Joi.string().allow(null),
    lastName: Joi.string().allow(null),
    contactNumber: Joi.string().allow(null).regex(/^(\(\d{3}\) |\d{3}-)\d{3}-\d{4}$/),
    designation: Joi.string().allow(null)
})

class UserModel {
    constructor(options) {
        const {
            _id = uuidv4(),
            username,
            password,
            email,
            roles,
            firstName,
            lastName,
            contactNumber,
            designation
        } = schemaValidator(schema, options)
        this._id = _id
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
        const toClient = removeNulls({
            id,
            username,
            email,
            roles,
            firstName,
            lastName,
            contactNumber,
            designation
        })
        return toClient
    }
}
module.exports = UserModel