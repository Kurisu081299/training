"use strict";
const dbConn = require("../../config/db.config");

const User = function(user) {
  this.email_add = user.email_add;
};

User.updateOne = function(email_add, result) {
  dbConn.query("SELECT * FROM user WHERE email_add = ?", [email_add], function(err, res) {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }

    if (res.length == 0 || !res[0].device_token) {
      return result(null, {message: 'No device tokens found'});
    }

    dbConn.query("UPDATE user SET device_token = NULL WHERE email_add = ?", [email_add], function(err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      }

      dbConn.query("UPDATE user_details SET device_token = NULL WHERE email_add = ?", [email_add], function(err, res) {
        if (err) {
          console.log("error: ", err);
          return result(err, null);
        }

        return result(null, {message: 'Successfully deleted device tokens'});
      });
    });
  });
};

module.exports = User;
