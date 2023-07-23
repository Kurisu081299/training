"use strict";
const dbConn = require("../../config/db.config");
const bcrypt = require("bcryptjs");

const User = function(user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.middle_name = user.middle_name;
  this.email_add = user.email_add;
  this.birthdate = user.birthdate;
  this.gender = user.gender;
  this.contactnum = user.contactnum;
  this.fb_name = user.fb_name;
  this.agency = user.agency;
  this.occupation = user.occupation;
  this.address_abroad = user.address_abroad;
  this.cur_country = user.cur_country;
  this.relative = user.relative;
  this.relative_num = user.relative_num;
};

User.updateOne = function(email_add, updatedUser, result) {
  dbConn.query("UPDATE user_details SET ? WHERE email_add = ?", [updatedUser, email_add], function(err, res) {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }

    return result(null, res);
  });
};


User.createEmailPass = function (newUser, result) {
  dbConn.query(
  "SELECT * FROM user WHERE email_add = ?",
  newUser.email_add,
  function (err, res) {
  if (err) {
  console.log("error: ", err);
  return result(err, null);
  }
    if (res.length > 0) {
      return result({ message: "Email has already been registered" }, null);
    }
  
    bcrypt.hash(newUser.password, 8, function (err, hash) {
      if (err) {
        console.log("error: ", result);
        return result(err, null);
      }
  
      newUser.password = hash;
  
      // Generate the member ID
      const member_id = parseInt(
        Buffer.from(newUser.email_add).toString("hex").substr(0, 12),
        16
      );
      newUser.member_id = member_id;
  
      // Insert the new user into the user table
      dbConn.query(
        "INSERT INTO user (email_add, password, device_token, member_id) VALUES (?, ?, ?, ?)",
        [
          newUser.email_add,
          newUser.password,
          newUser.device_token,
          newUser.member_id,
        ],
        function (err, res) {
          if (err) {
            console.log("error: ", err);
            return result(err, null);
          }
  
          console.log(res.insertId);
          var userId = res.insertId;
  
          // Insert the new user into the user_details table
          dbConn.query(
            "INSERT INTO user_details (email_add, password, device_token, member_id) VALUES (?, ?, ?, ?)",
            [
              newUser.email_add,
          newUser.password,
          newUser.device_token,
          newUser.member_id,
            ],
            function (err, res) {
              if (err) {
                console.log("error: ", err);
                return result(err, null);
              }
  
              console.log(res.insertId);
  
              // Insert the new user into the pictures table
              dbConn.query(
                "INSERT INTO pictures (email_add, member_id) VALUES (?, ?)",
                [
                  newUser.email_add,
                  newUser.member_id,
                ],
                function (err, res) {
                  if (err) {
                    console.log("error: ", err);
                    return result(err, null);
                  }
  
                  console.log(res.insertId);
  
                  var account = {
                    email_add: newUser.email_add,
                    user_id: userId,
                    account_type_id: 1,
                    account_id: userId, // set account_id the same as user_id
                  };
  
                  // Insert the new user into the account table
                  dbConn.query(
                    "INSERT INTO account SET ?",
                    account,
                    function (err, res) {
                      if (err) {
                        console.log("error: ", err);
                        return result(err, null);
                      }
  
                      console.log(res.insertId);
                      return result(null, { message: "User created successfully" });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
  };



User.createAdminOne = function (newAdmin, result) {
  dbConn.query(
    "SELECT * FROM user WHERE email_add = ?",
    newAdmin.email_add,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        return result(err, null);
      }

      if (res.length > 0) {
        return result(
          { message: "Email has already been registered" },
          null
        );
      }

      bcrypt.hash(newAdmin.password, 8, function (err, hash) {
        if (err) {
          console.log("error: ", err);
          return result(err, null);
        }

        newAdmin.password = hash;

        dbConn.query(
          "INSERT INTO user_details SET ?",
          newAdmin,
          function (err, res) {
            if (err) {
              console.log("error: ", err);
              return result(err, null);
            }

            console.log(res.insertId);
            var adminId = res.insertId;

            var admin = {
              email_add: newAdmin.email_add,
              password: newAdmin.password,
              user_id: adminId,
            };

            dbConn.query("INSERT INTO user SET ?", admin, function (
              err,
              res
            ) {
              if (err) {
                console.log("error: ", err);
                return result(err, null);
              }

              console.log(res.insertId);

              var account = {
                email_add: newAdmin.email_add,
                user_id: adminId,
                account_type_id: 2,
                account_id: adminId // set account_id the same as user_id
              };

              dbConn.query("INSERT INTO account SET ?", account, function(err, res) {
                if (err) {
                  console.log("error: ", err);
                  return result(err, null);
                }

                console.log(res.insertId);
                return result(null, res.insertId);
              });

            });

          }
        );
      });
    }
  );
};


User.deleteUserByEmail = function(email, result) {
  dbConn.beginTransaction(function(err) {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }

    dbConn.query("DELETE FROM account WHERE email_add = ?", email, function(err, res) {
      if (err) {
        console.log("error: ", err);
        return dbConn.rollback(function() {
          return result(err, null);
        });
      } else {
        console.log(res.affectedRows + " accounts deleted");

        dbConn.query("DELETE FROM user_details WHERE email_add = ?", email, function(err, res) {
          if (err) {
            console.log("error: ", err);
            return dbConn.rollback(function() {
              return result(err, null);
            });
          } else {
            console.log(res.affectedRows + " users deleted from user_details table");

            dbConn.query("DELETE FROM user WHERE email_add = ?", email, function(err, res) {
              if (err) {
                console.log("error: ", err);
                return dbConn.rollback(function() {
                  return result(err, null);
                });
              } else if (res.affectedRows == 0) {
                return dbConn.rollback(function() {
                  return result({message: "User not found in user table"}, null);
                });
              } else {
                console.log(res.affectedRows + " users deleted from user table");
                return dbConn.commit(function() {
                  return result(null, res.affectedRows);
                });
              }
            });
          }
        });
      }
    });
  });
};



module.exports = User;