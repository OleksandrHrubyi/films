const passport = require("passport");
const User = require("../model/schemas/users");
require("dotenv").config();
const Users = require("../model/users");



const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_url } = process.env;

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleParams = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_url,
    passReqToCallback: true
}

const googleCallback = async (req, accessToken, refreshToken, profile, done) => {
    try {
        const { displayName } = profile
        const email = profile.emails[0].value
        const user = await User.findOne({ email: email })
        if(user){
            return done(null, user);
        }
        const newUser = await User.create({email: email, name: displayName});
        done(null, newUser);
    } catch (error) {
        done(error, false);
    }
   
}

const googleStrategy = new GoogleStrategy(googleParams, googleCallback)

passport.use('google', googleStrategy)
module.exports = passport;