const Picture = require("../models/akoOFWGetPicture.model");
const path = require('path');

exports.getPicture = (req, res) => {
  const { email_add } = req.body;

  Picture.findOne(email_add, (err, picture) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error.");
    }

    if (!picture) {
      console.error(`Picture not found for email_add: ${email_add}`);
      return res.status(404).send("Picture not found.");
    }

    const { id_directory, first_name, last_name, email_add, name, description } = picture;

    if (!id_directory) {
      console.error(`id_directory not found for email_add: ${email_add}`);
      return res.status(404).send("id_directory not found.");
    }

    console.log(`id_directory: ${id_directory}`);

    const pictureAbsPath = path.join(__dirname, '../..', id_directory);
    res.set("Content-Type", "image/png");
    res.sendFile(pictureAbsPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error.");
      }
    });
  });
};


exports.getSignature = (req, res) => {
  const { email_add } = req.body;

  Picture.findOne(email_add, (err, picture) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error.");
    }

    if (!picture) {
      console.error(`Picture not found for email_add: ${email_add}`);
      return res.status(404).send("Picture not found.");
    }

    const { signature_directory } = picture;

    if (!signature_directory) {
      console.error(`signature_directory not found for email_add: ${email_add}`);
      return res.status(404).send("signature_directory not found.");
    }

    const signatureAbsPath = path.join(__dirname, '../..', signature_directory);
    res.set("Content-Type", "image/jpeg");
    res.sendFile(signatureAbsPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error.");
      }
    });
  });
};
