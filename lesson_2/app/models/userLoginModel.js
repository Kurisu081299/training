const dbConn = require("../config/db.config");

const UserModel = {};

UserModel.getByEmailOrUsername = (emailOrUsername) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      "SELECT * FROM user WHERE email_add = ? OR username = ?",
      [emailOrUsername, emailOrUsername],
      (error, result) => {
        if (error) {
          console.error("Error retrieving user by email or username: ", error);
          reject(error);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            console.log("User not found by email, trying username...");

            // If no results found by email, try again by username
            dbConn.query(
              "SELECT * FROM user WHERE username = ?",
              [emailOrUsername],
              (error, result) => {
                if (error) {
                  console.error("Error retrieving user by username: ", error);
                  reject(error);
                } else {
                  if (result.length > 0) {
                    resolve(result[0]);
                  } else {
                    resolve(null);
                  }
                }
              }
            );
          }
        }
      }
    );
  });
};

UserModel.getUserDetails = (userId) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      "SELECT * FROM user_details WHERE user_id = ?",
      [userId],
      (error, result) => {
        if (error) {
          console.error("Error retrieving user details: ", error);
          reject(error);
        } else {
          // Assuming only one row of user details is expected
          const userDetails = result[0] || {}; // Default to empty object if no details found
          resolve(userDetails);
        }
      }
    );
  });
};

module.exports = UserModel;
