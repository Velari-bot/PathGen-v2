import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';

dotenv.config();

// Configure the Discord strategy for Passport
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email'] // Request username, avatar, banner, and email
  },
  (accessToken, refreshToken, profile, done) => {
    // Log user info to console when they log in
    console.log(`✓ Discord login: ${profile.username}#${profile.discriminator} (ID: ${profile.id})`);
    
    // Extract only the data we need
    const user = {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      banner: profile.banner || null,
      email: profile.email || null
    };
    
    return done(null, user);
  }
));

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;

