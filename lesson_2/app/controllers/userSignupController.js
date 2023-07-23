const UserModel = require("../models/userSignupModel");
const nodemailer = require("nodemailer");

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: "robertchristian.rosales@gmail.com",
    pass: "lxkepxxjeixoymtu",
  },
});

exports.createUser = function (req, res) {
  const newUser = {
    email_add: req.body.email_add,
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    phone_number: req.body.phone_number
  };

  UserModel.create(newUser, (error, result) => {
    if (error) {
      if (error === 'Email address and username already exist') {
        console.error('Error creating user: email and username already exist');
        return res.status(409).json({
          error: 'Email address and username already exist',
          message: 'Error creating user: email and username already exist'
        });
      } else if (error === 'Email address already exists') {
        console.error('Error creating user: email already exists');
        return res.status(409).json({
          error: 'Email address already exists',
          message: 'Error creating user: email already exists'
        });
      } else if (error === 'Username already exists') {
        console.error('Error creating user: username already exists');
        return res.status(409).json({
          error: 'Username already exists',
          message: 'Error creating user: username already exists'
        });
      } else {
        console.error("Error creating user: ", error);
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Error creating user'
        });
      }
    } else {
      console.log("User created successfully");

      // Send welcome email
      const mailOptions = {
        from: "ICVI Tech Accounts <noreply@gmail.com>",
        to: newUser.email_add,
        subject: "Welcome to ICVI",
        text: "You are now registered and may continue to login!"
            };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending welcome email: ", error);
        } else {
          console.log("Welcome email sent: ", info.response);
        }
      });

      res.status(201).json({
        message: "User created successfully",
        data: result
      });
    }
  });
};
