const express = require('express')
const router = express.Router()
const {
  validCreateContact,
  validUpdateContacts,
  validUpdateStatus,
  validQueryContact,
} = require('./validation')

const {
  getAll,
  getById,
  createContact,
  rmContactById,
  updateContactsById,
  updateStatusFav,
} = require('../../controllers/films')

const guard = require('../../helper/guard')

router.get('/', guard, validQueryContact, getAll)

router.get('/:filmId', guard, getById)

router.post('/', guard, validCreateContact, createContact)

router.patch('/:filmId', guard, validUpdateContacts, updateContactsById)

router.patch('/:filmId/favorite', guard, validUpdateStatus, updateStatusFav)

router.delete('/:filmId', guard, rmContactById)

module.exports = router
