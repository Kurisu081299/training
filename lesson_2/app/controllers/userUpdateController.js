const UserModel = require("../models/userUpdateModel");

exports.updateUser = function (req, res) {
  const updatedUser = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone_number: req.body.phone_number
  };

  UserModel.update(req.body.userId, updatedUser, (error, result) => {
    if (error) {
      console.error("Error updating user: ", error);
      return res.status(500).json({
        error: 'Internal Server Error, id does not exist or username already exist',
        message: 'Error updating user'
      });
    } else {
      console.log("User updated successfully");

      res.status(200).json({
        message: "User updated successfully",
        data: result
      });
    }
  });
};
