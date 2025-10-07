const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const accountModel = require("../models/Account");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await accountModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await accountModel.create({
            username: `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
            password: "", // No password for Google users
            role: "user",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
