// Google Authentication using passport.js

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../infrastructure/database/userSchema";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_URL
    : process.env.DEVELOPMENT_URL;

console.log(serverUrl);
console.log(`${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }
      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : "",
        profile: profile.photos ? profile.photos[0].value : "",
        isVerified: true,
        isAdmin: false,
        isBlocked: false,
        isTutor: false,
      });
      return done(null, newUser);
    }
  )
);
