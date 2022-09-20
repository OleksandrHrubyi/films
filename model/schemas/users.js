const { Schema, model } = require("mongoose");
const Joi = require("joi");
const Subscription = require("../../helper/constants");
const bcrypt = require("bcryptjs");
const SALT_FACTOR = 6;
const gravatar = require('gravatar');
const { nanoid } = require('nanoid')


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/;
      return re.test(String(value).toLowerCase());
    },
  },
  subscription: {
    type: String,
    enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },

  favorites: {
    type: Array,
    default: false,
  },

  avatar: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '400' }, true)
    }
  },

  verify: {
    type: Boolean,
    default: false,
  },

  verifyTokenEmail: {
    type: String,
    required: true,
    default: nanoid(),
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};


const User = model("user", userSchema);

module.exports = User;
