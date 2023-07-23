const dbConn = require("../../config/db.config");
const bcrypt = require("bcryptjs");

const Login = function(login) {
  this.email_add = login.email_add;
  this.password = login.password;
  this.device_token = login.device_token;
};

Login.findByEmailAndPasswordMember = function(email_add, password, result) {
  dbConn.query("SELECT ud.user_details_id, ud.first_name, ud.last_name, ud.middle_name, ud.email_add, ud.birthdate, ud.gender, ud.contactnum, ud.fb_name, ud.agency, ud.occupation, ud.address_abroad, ud.cur_country, ud.relative, ud.relative_num, ud.password AS encrypted_password, a.account_type_id, ud.member_id FROM user_details ud JOIN account a ON ud.email_add = a.email_add WHERE ud.email_add = ?", [email_add], function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else if (res.length == 0) {
      result(null, null);
    } else {
      const user = res[0];
      bcrypt.compare(password, user.encrypted_password, function(err, isMatch) {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else if (!isMatch) {
          result(null, null);
        } else if (user.account_type_id != 1) {
          result(null, null);
        } else {
          delete user.encrypted_password;
          result(null, user);
        }
      });
    }
  });
};



Login.updatedevice_token = function(email_add, device_token, result) {
  dbConn.query("UPDATE user_details SET device_token = ? WHERE email_add = ?", [device_token, email_add], function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      dbConn.query("UPDATE user SET device_token = ? WHERE email_add = ?", [device_token, email_add], function(err, res) {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else {
          result(null, res);
        }
      });
    }
  });
};


module.exports = Login;



Login.findByEmailAndPasswordAdmin = function(email_add, password, result) {
  dbConn.query("SELECT ud.first_name, ud.last_name, ud.middle_name, ud.email_add, ud.birthdate, ud.gender, ud.contactnum, ud.fb_name, ud.agency, ud.occupation, ud.address_abroad, ud.cur_country, ud.relative, ud.relative_num, u.password, a.account_type_id FROM user_details ud JOIN user u ON ud.user_details_id = u.user_id JOIN account a ON a.email_add = u.email_add WHERE u.email_add = ?", [email_add], function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else if (res.length == 0) {
      result({message: "User not found or invalid login credentials"}, null);
    } else {
      const user = res[0];
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else if (!isMatch) {
          result({message: "User not found or invalid login credentials"}, null);
        } else if (user.account_type_id != 2) {
          result({message: "Check credentials"}, null);
        } else {
          delete user.password;
          result(null, user);
        }
      });
    }
  });
};

Login.allEmails = (callback) => {
  dbConn.query('SELECT email_add, device_token FROM user WHERE device_token IS NOT NULL AND TRIM(device_token) != ""', (error, results) => {
    if (error) {
      console.error('Error retrieving emails:', error);
      callback(error, null);
    } else {
      const emails = results.map((result) => ({ email_add: result.email_add, device_token: result.device_token }));
      callback(null, emails);
    }
  });
};

module.exports = Login;

