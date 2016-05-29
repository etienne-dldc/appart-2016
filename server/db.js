// Data
var fs = require("fs");
var file = 'data.db';
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

// Init
db.serialize(function () {
  // console.log("init database")
  if (!exists) {
    db.run("CREATE TABLE Users (id TEXT (100) UNIQUE NOT NULL, prenom  TEXT (200), contact TEXT (200), parent  TEXT (100), gender TEXT(20) );");
  }
});

exports.getAll = getAll;
exports.addUser = addUser;
exports.close = close;
exports.fromUser = fromUser;

function getAll(cb) {
  db.serialize(function () {
    var result = [];
    db.all("SELECT * FROM Users", function (err, data) {
      if (err) {
        console.error(err)
        cb(false)
      } else {
        cb(data)
      }
    });
  });
}

function addUser(data, cb) {




  db.serialize(function () {
    db.get("SELECT * FROM Users WHERE contact = ?;", [data.contact], function (err, row) {
      if (err) {
        console.error(err)
      } else {
        if (row) {
          // Already exist
          row.exist = true;
          cb(row)
        } else {
          db.run("INSERT INTO Users VALUES (?, ?, ?, ?, ?)", [data.id, data.prenom, data.contact, data.parent, data.gender], function () {
            data.exist = false;
            cb(data)
          });
        }
      }
    })


  });
}

function close() {
  db.close();
}

function fromUser(userId, cb) {
  getAll(function (allData) {
    if (allData === false) {
      cb(false);
    } else {
      var user = findUser(allData, userId)
      if (user == false) {
        cb(false)
      } else {
        var result = []
        do {
          result.push(user);
          if (user.parent !== null) {
            user = findUser(allData, user.parent)
          } else {
            user = false
          }
        } while (user);
        cb(result)
      }
    }
  })
}

function findUser(data, userId) {
  for (var i = 0; i < data.length; i++) {
    var user = data[i]
    if (user.id == userId) {
      return user;
    }
  }
  return false;
}
