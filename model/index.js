const Films = require("./schemas/films");

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 5,
    offset = 0,
  } = query;

  const optionsSearch = { owner: userId };

  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const result = await Films.paginate(optionsSearch, {
    limit,
    offset,
    favorite,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortBy}`]: -1 } : {}),
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: { path: "owner", select: "name email -_id" },
  });
  return result;
};

const getContactById = async (userId, contactId) => {
  const result = await Films.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "name email -_id",
  });
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Films.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const addContact = async (userId, body) => {
  const result = await Films.create({ ...body, owner: userId });
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Films.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (userId, contactId, { favorite }) => {
  const result = await Films.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
