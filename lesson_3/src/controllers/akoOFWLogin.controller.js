const dbConn = require("../../config/db.config");
const Login = require("../models/akoOFWLogin.model");

exports.login = function (req, res) {
  // Check if required fields are provided
  if (!req.body.email_add || !req.body.password) {
    res.status(400).send({
      error: true,
      message: "Please provide email and password",
    });
  } else {
    // Call the Login model's findByEmailAndPassword method
    Login.findByEmailAndPasswordMember(req.body.email_add, req.body.password, function (err, user) {
      if (err) {
        res.send(err);
      } else {
        if (!user) {
          res.status(404).send({
            error: true,
            message: "User not found or invalid login credentials",
          });
        } else {
          // If user is found, update the device_token
          Login.updatedevice_token(req.body.email_add, req.body.device_token, function(err, result) {
            if (err) {
              res.send(err);
            } else {
              res.json({
                error: false,
                message: "Member Login successful",
                data: user,
              });
            }
          });
        }
      }
    });
  }
};


  
  exports.loginAdmin = function (req, res) {
    // Check if required fields are provided
    if (!req.body.email_add || !req.body.password) {
      res.status(400).send({
        error: true,
        message: "Please provide email and password",
      });
    } else {
      // Call the Login model's findByEmailAndPassword method
      Login.findByEmailAndPasswordAdmin(req.body.email_add, req.body.password, function (err, user) {
        if (err) res.send(err);
        else res.json({
          error: false,
          message: "Admin Login successful",
          data: user,
        });
      });
    }
  };

  exports.getAllEmails = (req, res) => {
    Login.allEmails((error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  };
