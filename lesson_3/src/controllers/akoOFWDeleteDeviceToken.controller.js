const Login = require("../models/akoOFWDeleteDeviceToken.model");

exports.deleteDeviceTokenByEmail = async (req, res) => {
  const { email_add } = req.body;

  if (!email_add) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }

  try {
    Login.updateOne(email_add, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (result && result.message) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(404).json({ message: `No device tokens found for email: ${email_add}` });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
