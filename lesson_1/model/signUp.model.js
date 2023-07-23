const dbConn = require("../config/db.config");

const User = {};

User.create = (newUser, callback) => {
    dbConn.query(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [newUser.username, newUser.password],
        (error, result) => {
            if (error) {
                console.error("Error inserting user into the database: ", error);
                return callback(error, null);
            } else {
                return callback(null, result);
            }
        }
    );
};

module.exports = User;
