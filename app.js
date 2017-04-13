const express = require("express");
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const routes = require('./routes');

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env;

/*
 * Init Facebook Strategy
 */
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("logged by Facebook", profile)
      cb()
    }
  ));
}

/*
 * Init Twitter Strategy
 */
if (TWITTER_CONSUMER_KEY && TWITTER_CONSUMER_SECRET) {
  passport.use(new TwitterStrategy({
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
      console.log("logged by Twitter", profile)
      cb()
    }
  ));
}

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.set('port', process.env.port || 3000);
app.use(express.static('src/public'));
app.set('views', "./views");
app.set('view engine', 'pug');

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});
