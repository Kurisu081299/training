const UserModel = require("../model/signUp.model");
const bcrypt = require("bcrypt");

exports.createUser = function (req, res) {
    const newUser = {
        username: req.body.username,
        password: req.body.password
    }

    // Hash the user's password before saving it to the database
    bcrypt.hash(newUser.password, 10, (error, hashedPassword) => {
        if (error) {
            console.error("Error hashing password: ", error);
            return res.status(500).send("Error creating user");
        }

        newUser.password = hashedPassword;

        UserModel.create(newUser, (error, result) => {
            if (error) {
                console.error("Error creating user: ", error);
                return res.status(500).send("Error creating user");
            } else {
                console.log("User created successfully");
                return res.status(201).json({
                    message: "User created successfully",
                    data: result,
                });
            }
        });
    });
};
