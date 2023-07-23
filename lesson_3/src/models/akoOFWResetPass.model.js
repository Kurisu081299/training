const dbConn = require("../../config/db.config");
const bcrypt = require("bcryptjs");

const Reset = function(reset) {
  this.email_add = reset.email_add;
  this.password = reset.password;
};

Reset.updatePassword = function(email_add, new_password, result) {
  dbConn.query("SELECT * FROM user WHERE email_add = ?", email_add, function(err, res) {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }

    if (res.length == 0) {
      return result({message: "Email not found in database"}, null);
    }

    bcrypt.hash(new_password, 8, function(err, hash) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      }

      new_password = hash;

      // Update the user's password in the user table
      dbConn.query("UPDATE user SET password = ? WHERE email_add = ?", [new_password, email_add], function(err, res) {
        if (err) {
          console.log("error: ", err);
          return result(err, null);
        }

        console.log(res.affectedRows + " record(s) updated in user table");

        // Update the user's password in the user_details table
        dbConn.query("UPDATE user_details SET password = ? WHERE email_add = ?", [new_password, email_add], function(err, res) {
          if (err) {
            console.log("error: ", err);
            return result(err, null);
          }

          console.log(res.affectedRows + " record(s) updated in user_details table");

          return result(null, res.affectedRows);
        });
      });
    });
  });
};

module.exports = Reset;
