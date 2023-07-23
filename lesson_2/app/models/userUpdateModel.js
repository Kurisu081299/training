const dbConn = require("../config/db.config");
const bcrypt = require('bcrypt');

const UpdatedUser = {};

UpdatedUser.update = (userId, updatedUser, callback) => {
  // Check if the user with the provided userId exists
  dbConn.query(
    "SELECT * FROM user WHERE id = ?",
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error checking user existence: ", error);
        return callback(error, null);
      } else if (result.length === 0) {
        // User with the provided userId doesn't exist
        return callback("User ID doesn't exist", null);
      } else {
        // Proceed with updating the user
        // Check if the email address or username already exists
        dbConn.query(
          "SELECT * FROM user WHERE (email_add = ? OR username = ?) AND id <> ?",
          [updatedUser.email_add, updatedUser.username, userId],
          (error, result) => {
            if (error) {
              console.error("Error checking email address and username existence: ", error);
              return callback(error, null);
            } else if (result.length > 0) {
              // Email address or username already exists
              const existingUser = result[0];
              if (existingUser.email_add === updatedUser.email_add && existingUser.username === updatedUser.username) {
                return callback("Email address and username already exist", null);
              } else if (existingUser.email_add === updatedUser.email_add) {
                return callback("Email address already exists", null);
              } else if (existingUser.username === updatedUser.username) {
                return callback("Username already exists", null);
              }
            } else {
              // Hash the password
              const saltRounds = 10;
              const password = updatedUser.password.toString();
              bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                  console.error("Error hashing password: ", err);
                  return callback(err, null);
                } else {
                  // Update the user in the 'user' table
                  dbConn.query(
                    "UPDATE user SET username = ?, password = ? WHERE id = ?",
                    [updatedUser.username, hashedPassword, userId],
                    (error, result) => {
                      if (error) {
                        console.error("Error updating user in database: ", error);
                        return callback(error, null);
                      } else {
                        // Update user details in the 'user_details' table
                        dbConn.query(
                          "UPDATE user_details SET phone_number = ?, name = ? WHERE user_id = ?",
                          [updatedUser.phone_number, updatedUser.name, userId],
                          (error, result) => {
                            if (error) {
                              console.error("Error updating user details in database: ", error);
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
      }
    }
  );
};

module.exports = UpdatedUser;
