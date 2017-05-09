const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req,res) => {
  res.render('index');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });

router.get('/success', (req, res) => {
  if (req.user.emails) res.render('success', { name: req.user.displayName, email: req.user.emails[0].value});
  else res.render("success");
});

module.exports = router;
