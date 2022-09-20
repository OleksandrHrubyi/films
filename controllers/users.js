const jwt = require("jsonwebtoken");
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path')
const Users = require("../model/users");
const { HttpCode } = require("../helper/constants");
const EmailService = require('../services/email')
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const registration = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email in use",
    });
  }
  try {
    const newUser = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "succes",
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
        avatar: newUser.avatar

      },

    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);

  const isValidPassword = await user?.validPassword(password);

  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTH).json({
      status: "error",
      code: HttpCode.UNAUTH,
      message: "Invalid credential",
    });
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
  await Users.updateToken(user.id, token);
  return res.status(HttpCode.OK).json({
    status: "succes",
    code: HttpCode.OK,
    data: { token },
    name: user.name,
  });
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const refresh = async (req, res, next) => {
  console.log(req);
  return res.status(HttpCode.OK).json({
    code: HttpCode.OK,
    user: req.user.name
  });
};

const getFavorites = async (req, res, next) => {
  console.log('requst');
  if (req.id) {
    await Users.addFavoriteFilm(req.id, req);
    return res.status(201).json({
      status: "succes",
      code: 201,
      message: "add to favorite",
    });
  } else {
    return res.json({
      status: 400,
      message: "missing field favorite",
    });
  }
}


const updateAvatar = async (req, res, next) => {
  const { id } = req.user
  const avatarUrl = await saveAvatarUser(req)
  await Users.updateAvatar(id, avatarUrl)
  return res.status(HttpCode.OK).json({ status: 'succes', code: HttpCode.OK, data: { avatarUrl } })
}

const saveAvatarUser = async (req) => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await jimp.read(pathFile);
  await img.autocrop().cover(400, 400, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE).writeAsync(pathFile);
  try {
    await fs.rename(pathFile, path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar))
  }
  catch (err) {
    console.log(err.message);
    return err
   }
  const oldAvatar = req.user.avatar
  if (oldAvatar.includes(`${FOLDER_AVATARS}`)) {
    await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
  }

  return path.join(FOLDER_AVATARS, newNameAvatar)
}


const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyTokenEmail(req.params.token)
    if (user) {
      await Users.updateVerifyToken(user.id, true, null)
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification successful' },
      })
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Invalid token. Contact to administration',
    })
  } catch (error) {
    next(error)
  }
}

const repeatEmailVerify = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      const { name, verifyTokenEmail, email } = user
      const emailService = new EmailService(process.env.NODE_ENV)
      await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification email resubmitted' },
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    })
  } catch (error) {
    next(error)
  }
}




module.exports = {
  registration,
  login,
  logout,
  updateAvatar,
  refresh,
  getFavorites,
  repeatEmailVerify,
  verify,
};
