var express = require('express');
var bodyParser = require('body-parser')
var shortid = require('shortid');
var apiFallback = require('express-history-api-fallback');

var db = require('./db');
var secret = require('./secret');

var dist = __dirname + '/../dist'

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static
console.log(dist)
app.use(express.static(dist));

/**
 * API
 */
app.get('/api/from/:userId', function (req, res, next) {
  db.fromUser(req.params.userId, function (data) {
    if (data) {
      res.json({
        success: true,
        data: data
      });
    } else {
      res.json({
        success: false,
        error: 'Something broke!'
      });
    }
  })
})

app.get(('/api/all/' + secret), function (req, res, next) {
  db.getAll(function (data) {
    res.json(data)
  })
})

app.post('/api', function (req, res, next) {
  // Verif data

  var prenom = req.body.prenom
  var contact = req.body.contact
  var parent = req.body.parent
  var gender = req.body.gender

  if (['mec', 'meuf'].indexOf(gender) == -1) {
    res.json({
      success: false,
      error: 'Wrong gender'
    });
    return
  }

  var data = {
    id: shortid.generate(),
    prenom: prenom,
    contact: contact,
    parent: parent,
    gender: gender
  }
  db.addUser(data, function (result) {
    res.json({
      success: true,
      data: result
    });
  })
})

app.use(apiFallback('index.html', { root: dist }))

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
