// module.exports = function(app, passport, db) {
module.exports = function(app, passport, db, ObjectId) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
  var uId = ObjectId(req.session.passport.user)
  var uName
  // GET UNAME FROM OBJECTID
  db.collection('users').find({"_id": uId}).toArray((err, result) => {
    if (err) return console.log(err)
    uName = result[0].local.username
    // GET SAVEDHOUSE BY UNAME
    db.collection('savedHouses').find({"username": uName}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user : req.user,
        savedHouses: result
      })
    })
  });
});

  // app.get('/profile', isLoggedIn, function(req, res) {
  //   console.log("req.user.local.username", req.user.local.username);
  //   db.collection('savedHouses').find({"user": req.user.local.username}).toArray((err, result) => {
  //   // db.collection('savedHouses').find().toArray((err, result) => {
  //
  //     if (err) return console.log(err)
  //     res.render('profile.ejs', {
  //       user: req.user,
  //       savedHouses: result
  //     })
  //   })
  // });

  // GET individual house pages
  app.get('/savedHouses/:house_id', function(req, res) {
    console.log("req.params",req.params);
      console.log("req.params.house_id",req.params.house_id);
      var uId = ObjectId(req.params.house_id)
      db.collection('savedHouses').find({"_id": uId}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('house.ejs', {
          savedHouses: result
        })
      })

  });



  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/saveHouse', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    var uName
    // GET UNAME FROM OBJECTID
    db.collection('users').find({"_id": uId}).toArray((err, result) => {
      if (err) return console.log(err)
      uName = result[0].local.username
      // SAVE UNAME AND OTHER PROPERTIES
      db.collection('savedHouses').save({
        username: uName,
        rawAddress: req.body.rawAddress,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        price: req.body.ZestimateAmt
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved house to database')
        res.redirect('/profile')
      })
    })

  })

  // app.post('/saveHouse', (req, res) => {
  //   db.collection('savedHouses').save({
  //       user: req.body.user,
  //       rawAddress: req.body.rawAddress,
  //       latitude: req.body.latitude,
  //       longitude: req.body.longitude
  //     },
  //     (err, result) => {
  //       if (err) return console.log(err)
  //       console.log('saved house to database')
  //       res.redirect('/profile')
  //     })
  // })

  // app.put('/thumbUp', (req, res) => {
  //   db.collection('messages')
  //     .findOneAndUpdate({
  //       name: req.body.name,
  //       url: req.body.url
  //     }, {
  //       $set: {
  //         thumbCount: req.body.thumbCount + 1
  //       }
  //     }, {
  //       sort: {
  //         _id: -1
  //       },
  //       upsert: false
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })


  //STAR A HOUSE
  app.put('/starHouse', (req, res) => {
    db.collection('savedHouses')
      .findOneAndUpdate({
        rawAddress: req.body.rawAddress
      }, {
        $set: {
          starred: "*STAR!*"
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })



  app.delete('/removeHouse', (req, res) => {
    db.collection('savedHouses').findOneAndDelete({
      rawAddress: req.body.rawAddress
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
