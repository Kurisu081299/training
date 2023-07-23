const Reset = require("../models/akoOFWResetPass.model");

exports.updatePass = function(req, res) {
  const email_add = req.body.email_add;
  const new_password = req.body.new_password;

  Reset.updatePassword(email_add, new_password, function(err, data) {
    if (err) {
      return res.status(500).send({
        error: true,
        message: err.message || "Error occurred while updating password."
      });
    }

    return res.send({ 
        error: false,
        message: "Reset password successful!" });
  });
};
