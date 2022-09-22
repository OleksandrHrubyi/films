const Joi = require('joi')

const patternLink = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

const schemaAddContact = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().pattern(new RegExp(patternLink)).optional(),
  ganre: Joi.string().optional(),
  phone: Joi.number(),
  year: Joi.string().required(),
  link: Joi.string().optional(),
  favorite: Joi.boolean().optional(),
})

const schemaQueryContact = Joi.object({
  sortBy: Joi.string().valid('name', 'id').optional(),
  sortByDesc: Joi.string().valid('name', 'id').optional(),
  filter: Joi.string().valid('name', 'id', 'favorite').optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  offset: Joi.number().integer().min(0).optional(),
  favorite: Joi.boolean().optional(),
}).without('sortBy', 'sortByDesc')

const schemaUpdateContact = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().pattern(new RegExp(patternLink)).optional(),
  ganre: Joi.string().optional(),
  phone: Joi.number(),
  year: Joi.string().required(),
  link: Joi.string().optional(),
  favorite: Joi.boolean().optional(),
}).or('name', 'email', 'phone')

const schemaUpdateStatus = Joi.object({
  favorite: Joi.boolean().optional(),
})

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    return next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

module.exports = {
  validQueryContact: async (req, res, next) => {
    return await validate(schemaQueryContact, req.query, next)
  },
  validCreateContact: async (req, res, next) => {
    return await validate(schemaAddContact, req.body, next)
  },
  validUpdateContacts: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next)
  },
  validUpdateStatus: async (req, res, next) => {
    return await validate(schemaUpdateStatus, req.body, next)
  },
}
