const express = require("express");
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const expressStylus = require('express-stylus-middleware');
const routes = require('./routes');

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env;

const isFacebookActive = FACEBOOK_APP_ID && FACEBOOK_APP_SECRET;
const isTwitterActive = TWITTER_CONSUMER_KEY && TWITTER_CONSUMER_SECRET;
/*
 * Init Facebook Strategy
 */
if (isFacebookActive) {
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'emails']
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  ));
}

/*
 * Init Twitter Strategy
 */
if (isTwitterActive) {
  passport.use(new TwitterStrategy({
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
      return cb(null, profile);
    }
  ));
}

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.set('port', process.env.port || 3000);
app.use('/css', expressStylus(__dirname + '/public/stylus-css/'));
app.use(express.static('public'));
app.set('views', "./views");
app.set('view engine', 'pug');
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});
