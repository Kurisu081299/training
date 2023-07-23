const dbConn = require("../config/db.config");
const bcrypt = require('bcrypt');

const User = {};

User.create = (newUser, callback) => {
  // Check if the email address or username already exists
  dbConn.query(
    "SELECT * FROM user WHERE email_add = ? OR username = ?",
    [newUser.email_add, newUser.username],
    (error, result) => {
      if (error) {
        console.error("Error checking email address and username existence: ", error);
        return callback(error, null);
      } else if (result.length > 0) {
        // Email address or username already exists
        const existingUser = result[0];
        if (existingUser.email_add === newUser.email_add && existingUser.username === newUser.username) {
          return callback("Email address and username already exist", null);
        } else if (existingUser.email_add === newUser.email_add) {
          return callback("Email address already exists", null);
        } else if (existingUser.username === newUser.username) {
          return callback("Username already exists", null);
        }
      } else {
        // Hash the password
        const saltRounds = 10;
        const password = newUser.password.toString();
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password: ", err);
            return callback(err, null);
          } else {
            // Insert the user into the 'user' table
            dbConn.query(
              "INSERT INTO user (email_add, username, password, category) VALUES (?, ?, ?, ?)",
              [newUser.email_add, newUser.username, hashedPassword, newUser.category],
              (error, result) => {
                if (error) {
                  console.error("Error inserting user into database: ", error);
                  return callback(error, null);
                } else {
                  const userId = result.insertId; // Retrieve the auto-generated user ID

                  // Insert user details into the 'user_details' table
                  dbConn.query(
                    "INSERT INTO user_details (user_id, phone_number, name) VALUES (?, ?, ?)",
                    [userId, newUser.phone_number, newUser.name],
                    (error, result) => {
                      if (error) {
                        console.error("Error inserting user details into database: ", error);
                        return callback(error, null);
                      } else {
                        return callback(null, result);
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
};

module.exports = User;
