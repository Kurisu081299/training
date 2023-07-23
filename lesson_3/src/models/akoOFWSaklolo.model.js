const dbConn = require("../../config/db.config");

const Saklolo = function(saklolo) {
  this.email_add = saklolo.email_add;
  this.reason = saklolo.reason;
  this.message = saklolo.message;
};

Saklolo.create = function(newSaklolo, result) {
  dbConn.query("INSERT INTO saklolo set ?", newSaklolo, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

Saklolo.prototype.save = function(result) {
  const newSaklolo = {
    email_add: this.email_add,
    reason: this.reason,
    message: this.message
  };
  dbConn.query("INSERT INTO saklolo SET ?", newSaklolo, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

Saklolo.findByEmailAddress = function(email, result) {
  dbConn.query("SELECT reason, message FROM saklolo WHERE email_add = ?", [email], function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Saklolo;
