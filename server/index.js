'use strict';

const express = require('express');
const morgan = require('morgan')
const cors = require('cors');

const { check, validationResult } = require('express-validator');

const userDao = require('./daoUsers');
const riddleDao = require('./daoRiddles');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Setup CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Setup local strategy
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password);
  if (!user) {
    return callback(null, false, 'Incorrect username and/or password');
  }

  return callback(null, user);
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// Create session
app.use(session({
  secret: 'secretToNotBeToldToAnyone',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// Auth verification middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({error: 'Not authorized'});
}

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

// APIs

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({error: 'Not authenticated'});
  }
});

app.delete('/api/sessions/current',
(req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


app.get('/api/listRiddles/:id',
(req, res) => {
  riddleDao.getlistRiddles(req.params.id, req.user?.id)
    .then(riddles => res.json(riddles))
    .catch((err) => res.status(500).json(err));
});

app.post('/api/riddles',
isLoggedIn, 
 [check('text').trim().not().isEmpty(),
  check('answer').trim().not().isEmpty(),
  check('hint1').trim().not().isEmpty(),
  check('hint2').trim().not().isEmpty(),
  check('difficulty').isInt({ min: 1, max: 3 }),
  check('duration').isInt({ min: 30, max: 600 })
 ],
async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter); // format error message
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const riddle = {
    text: req.body.text,
    answer: req.body.answer,
    hint1: req.body.hint1,
    hint2: req.body.hint2,
    difficulty: req.body.difficulty,
    duration: req.body.duration,
    user: req.user.id
  };

  try {
    const result = await riddleDao.createRiddle(riddle);
    res.json(result);
  } catch (err) {
    res.status(503).json({error: `Database error during the creation of new riddle: ${err}` })
  }
});

app.put('/api/riddles/:id',
isLoggedIn,
[ 
  check('id').isInt()
],
async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter); // format error message
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await riddleDao.setRiddleClosed(req.params.id, 0);
    res.json(result);
  } catch (err) {
    res.status(503).json({error: `Database error during the update of the riddle: ${err}` })
  }
});

app.get('/api/ranking', (req, res) => {
  userDao.getRankings()
    .then(ranking => res.json(ranking))
    .catch((err) => res.status(500).json(err));
});

app.post('/api/answers',
isLoggedIn,
[ 
  check('riddleid').isInt(),
  check('answer').trim().not().isEmpty()
],
async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter); // format error message
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the answer is correct (before adding it to the db)
    const isCorrect = await riddleDao.checkAnswer(req.body.riddleid, req.body.answer);
    if (check(isCorrect).isInt()) {

      // If the answer is correct, we want to close the riddle and add the points to the 
      // user that won
      if (isCorrect === 1) {
        const riddle = await riddleDao.setRiddleClosed(req.body.riddleid, req.user.id);
        const pointsAdded = await userDao.addPoints(riddle.difficulty, req.user.id);
      }

      // In the answers we save also the username, to not have to fetch it separately when 
      //visualizing the rank
      const userName = await userDao.getUserById(req.user.id);

      // Create the answer to be inserted in the db
      const answer = {
        riddleid: req.body.riddleid,
        userid: req.user.id,
        user: userName.username,
        answer: req.body.answer,
        correct: isCorrect
      };

      // Insert the answer in the db
      const result = await riddleDao.addAnswer(answer);
      res.json(result);
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (err) {
      res.status(503).json({error: `Database error during the insertion of the answer: ${err}` })
  }

});

app.get('/api/answers/:id',
isLoggedIn,
[ check('id').isInt() ],
async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter); // format error message
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const result = await riddleDao.getlistAnswers(req.params.id);
    if (result.error)
      res.status(404);
    else
      res.json(result);
  } catch (err) {
    res.status(500);
  }
});

// init express
const port = 3001;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});