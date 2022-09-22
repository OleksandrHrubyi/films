const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const passport = require('../../middlewares/authenticate')
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;



module.exports = router;
