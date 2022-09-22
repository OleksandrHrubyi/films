const { string } = require('joi')
const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const contactsSchema = new Schema({
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  year: {
    type: String,
  },
  link: {
    type: String,
  },
  favorite: {
    type: String,
    default: false,
  },
})

contactsSchema.path('name').validate((value) => {
  const re = /[A-Z a-z]\w+/
  return re.test(String(value))
})

contactsSchema.virtual('strPhone').get(function () {
  return `${this.phone} phone`
})

const Contact = model('contact', contactsSchema)

module.exports = Contact
