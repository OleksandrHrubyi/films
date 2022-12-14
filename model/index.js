const Films = require('./schemas/films')

const listContacts = async (userId, query) => {
  const { limit = 10, page = 1, favorite = null } = query
  const optionsSearch = { owner: userId }

  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }

  const skip = (Number(page) - 1) * Number(limit)
  const total = await Films.count()
  const totalPage = Math.ceil(Number(total) / Number(limit))
  const result = await Films.find({}, '-name -createdAt -updatedAt', {
    skip,
    limit: Number(limit),
    page: Number(page),
  })
  return { list: result, totalPage }
}

const getContactById = async (userId, contactId) => {
  const result = await Films.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'name email -_id',
  })
  return result
}

const removeContact = async (userId, contactId) => {
  const result = await Films.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  })
  return result
}

const addContact = async (userId, body) => {
  const result = await Films.create({ ...body, owner: userId })
  return result
}

const updateContact = async (userId, contactId, body) => {
  const result = await Films.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  )
  return result
}

const updateStatusContact = async (userId, contactId, { favorite }) => {
  const result = await Films.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    { new: true },
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
