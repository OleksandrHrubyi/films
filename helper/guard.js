const passport = require("passport");
const { HttpCode } = require("./constants");
require("../config/passport");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
  if (!user || err || !user.token) {
      return res.status(HttpCode.UNAUTH).json({
        status: "error",
        code: HttpCode.UNAUTH,
        message: "Not authorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
