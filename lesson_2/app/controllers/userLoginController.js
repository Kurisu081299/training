const UserModel = require('../models/userLoginModel');
const bcrypt = require('bcrypt');

const userLoginController = {};

userLoginController.checkEmail = async (req, res) => {
  const { email_or_username, password } = req.body;

  try {
    // Get user by email or username
    const user = await UserModel.getByEmailOrUsername(email_or_username);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    // Retrieve user details
    const userDetails = await UserModel.getUserDetails(user.id);

    // Construct the response object with the desired fields
    const response = {
      message: "Login successful",
      userDetails: [
        {
          id: user.id,
          email_add: user.email_add,
          username: user.username,
          name: userDetails.name,
          phone_number: userDetails.phone_number,
          modified_at: user.modified_at,
          created_at: user.created_at
        }
      ]
    };

    // Return the response
    res.status(200).json(response);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
};

module.exports = userLoginController;
