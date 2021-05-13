const express = require('express');

const router = express.Router();
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model');

router.get('/login', (req, res) => res.render('auth/login', { message: req.flash('success') }));

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.render('index'));
});


// router.post('/login', (req, res) => {
//   console.log('SESSION =====> ', req.session);
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//     passReqToCallback: true,
//   })
// }
// );


router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;
  passport.authenticate('local', (dbUser) => {
    if (email === '' || password === '') {
      return res.render('auth/login' , {errorMessage: "You have to fill all the fields"}); 
    }

    if (!dbUser) {
       return res.render('auth/login', { errorMessage: 'Wrong password or username' });
    }

    //  req.session.currentUser = dbUser
    // const link = `/user/${dbUser.id}`;

    req.login(dbUser, err => {
      if (err) { 
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
        return next(err);
      }
  
      res.redirect("/");

    });
  })(req, res, next);
});

module.exports = router;
