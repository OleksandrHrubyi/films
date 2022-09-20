const express = require("express");
const router = express.Router();
const { registration, login, logout, updateAvatar, refresh } = require("../../controllers/users");
const guard = require("../../helper/guard");
const  passport = require('../../middlewares/authenticate')
// const actions = require("../../model/schemas/auth");

const uploadAvatar = require('../../helper/upload-avatar')

router.post("/signup", registration);
router.post("/login", login);
router.get("/current", guard, refresh);
router.post("/logout", guard, logout);
router.patch(
    "/avatars",
    guard,
    uploadAvatar.single('avatar'),
    updateAvatar)

router.get("/google", passport.authenticate("google", {scope:["email", "profile"]}))
router.get("/google/callback", passport.authenticate("google", {session: false}), async(req, res)=> {
    
    const payload = {
        id: req.user._id
    };

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"});

    res.json(token);
    
    res.redirect("/")
})

module.exports = router;
