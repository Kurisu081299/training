const User = require("../models/akoOFWSign.model");

exports.updateUserDetails = function (req, res) {
  // Check if required fields are provided
  const requiredFields = [
    "email_add",
    "first_name",
    "last_name",
    "middle_name",
    "birthdate",
    "gender",
    "contactnum",
    "fb_name",
    "agency",
    "occupation",
    "address_abroad",
    "cur_country",
    "relative",
    "relative_num",
  ];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    res.status(400).send({
      error: true,
      message:
        "Please provide all required fields (missing fields: " +
        missingFields.join(", ") +
        ")",
    });
  } else {
    // Update the user details in the database
    const updated_user_details = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      middle_name: req.body.middle_name,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      contactnum: req.body.contactnum,
      fb_name: req.body.fb_name,
      agency: req.body.agency,
      occupation: req.body.occupation,
      address_abroad: req.body.address_abroad,
      cur_country: req.body.cur_country,
      relative: req.body.relative,
      relative_num: req.body.relative_num,
    };

    User.updateOne(
      req.body.email_add,
      updated_user_details,
      function (err, result) {
        if (err) {
          console.log("error: ", err);
          res.status(500).send({
            error: true,
            message: "An error occurred while updating the user details",
          });
        } else if (result.affectedRows === 0) {
          res.status(404).send({
            error: true,
            message:
              "User with email address " + req.body.email_add + " not found",
          });
        } else {
          res.json({
            error: false,
            message: "User details updated successfully!",
            data: result,
          });
        }
      }
    );
  }
};

exports.createEmailPass = function (req, res) {
  // Check if required fields are provided
  if (!req.body.email_add || !req.body.password) {
    res.status(400).send({
      error: true,
      message: "Please provide email and password",
    });
  } else {
    // Create the new User object with email formatting
    const emailRegex = /\S+@\S+\.\S+/; // regular expression for email format
    if (!emailRegex.test(req.body.email_add)) {
      res.status(400).send({
        error: true,
        message: "Invalid email format",
      });
      return;
    }
    const new_user = {
      email_add: req.body.email_add,
      password: req.body.password,
      device_token: req.body.device_token,
    };

    // Generate the member ID
    const member_id = parseInt(
      Buffer.from(new_user.email_add).toString("hex").substr(0, 12),
      16
    );
    new_user.member_id = member_id;

    // Save the new User to the database
    User.createEmailPass(new_user, function (err, result) {
      if (err) {
        console.log("error: ", err);
        res.status(500).send({
          error: true,
          message: "Email has already been registered ",
        });
      } else {
        res.json({
          error: false,
          message: "User added successfully!",
          email_add: new_user.email_add,
          member_id: new_user.member_id,
          data: result,
        });
      }
    });
  }
};


exports.createAdminOne = function (req, res) {
  // Check if required fields are provided
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.middle_name ||
    !req.body.email_add ||
    !req.body.password ||
    !req.body.birthdate ||
    !req.body.gender ||
    !req.body.contactnum ||
    !req.body.fb_name ||
    !req.body.agency ||
    !req.body.occupation ||
    !req.body.address_abroad ||
    !req.body.cur_country ||
    !req.body.relative ||
    !req.body.relative_num
  ) {
    return res.status(400).send({
      error: true,
      message:
        "Please provide all required fields (one or more fields are empty!)",
    });
  }

  // Create the new User object
  const new_admin = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    middle_name: req.body.middle_name,
    email_add: req.body.email_add,
    password: req.body.password,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    contactnum: req.body.contactnum,
    fb_name: req.body.fb_name,
    agency: req.body.agency,
    occupation: req.body.occupation,
    address_abroad: req.body.address_abroad,
    cur_country: req.body.cur_country,
    relative: req.body.relative,
    relative_num: req.body.relative_num,
  });

  // Save the new User to the database
  User.createAdminOne(new_admin, function (err, user) {
    if (err) {
      console.log("error: ", err);
      return res.status(500).send({
        error: true,
        message: "Email has already been registered (Admin) ",
      });
    }

    // Send the response to the client
    res.json({
      error: false,
      message: "Admin added successfully!",
      data: user,
    });
  });
};

exports.deleteUserByEmail = function(req, res) {
  const email = req.body.email_add;

  User.deleteUserByEmail(email, function(err, result) {
    if (err) {
      console.log("error: ", err);
      res.status(500).send({
        error: true,
        message: "Error deleting user",
      });
    } else {
      res.json({
        error: false,
        message: "User deleted successfully!",
      });
    }
  });
};
