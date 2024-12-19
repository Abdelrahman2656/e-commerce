import dotenv from "dotenv";
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from "path";
dotenv.config({path :path.resolve('./config/.env') })
// passport.use(new GoogleStrategy({
//     clientID:process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//   done(null , profile)
//   }
// ));

// passport.serializeUser((user,done)=>{
//     done(null,user)
// })

// passport.deserializeUser((user,done)=>{
//     done(null ,user)
// })
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../Database/index.js"; // Replace with the path to your User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_ID,
      callbackURL: "/api/v1/auth/google/callback", // The redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If not, create a new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Ensure 'email' is requested in scope
            avatar: profile.photos[0].value, // Optional: user profile picture
            role: "user", // Default role
            status: "VERIFIED",
          });
        }

        // Pass user to the callback
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user (for session support)
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize the user ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
