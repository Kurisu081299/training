const Picture = require("../models/akoOFWUpload.model");
const multer = require("multer");
const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const Jimp = require('jimp');
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      if (file.fieldname === 'picture') {
        cb(null, './tmp/');
      } else if (file.fieldname === 'signature') {
        cb(null, './tmp/');
      }
    },
    filename: function(req, file, cb) {
      const { first_name, last_name } = req.body;
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, "");
      const suffix = file.fieldname === 'signature' ? '_signature' : '';
      const newName = `${currentDate}${timestamp}${suffix}.png`;
      cb(null, newName);
    }
  }),
  fileFilter: function(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .jpg and .png files are allowed!'));
    }
  },
  limits: {
    fileSize: 6 * 1024 * 1024 // 2MB limit
  }
}).fields([{ name: 'picture', maxCount: 1 }, { name: 'signature', maxCount: 1 }]);

exports.uploadPicture = (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    // Check if required fields are empty
    const requiredFields = ['first_name', 'last_name', 'email_add'];
    const missingFields = requiredFields.filter(field => !req.body[field] && !req.files[field]);
    if (missingFields.length) {
      return res.status(400).send(`The following fields are missing: ${missingFields.join(', ')}`);
    }

    const { first_name, last_name, middle_name, email_add, member_id } = req.body;
    

    let pictureDirectory = null; // Initialize the picture directory

    if (req.files && req.files.picture && req.files.picture.length > 0) {
      // Resize the picture
      const picture = await Jimp.read(req.files.picture[0].path);
      picture.resize(350, 350);
    
      // Load the ID layout image
      const idLayoutPath = path.join(__dirname, '..', '..', 'id_layout', 'id_layout.png');
      const idLayout = await Jimp.read(idLayoutPath);
    
      // Place the picture on top of the ID layout image
      const x = 59;
      const y = 173;
      idLayout.composite(picture, x, y);
    
      // Add the name on top of the ID layout image
      const font = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
      const nameX = 440;
      const nameY = 415;
      const nameText = `${first_name} ${middle_name} ${last_name}`.toUpperCase();
      const arialBold = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      idLayout.print(arialBold, nameX, nameY, { text: nameText, bold: true });
    
      // Add the member_id on top of the ID layout image
      const font1 = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
      const memberX = 440;
      const memberY = 495;
      const memberText = `${member_id}`;
      const arialBold1 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      idLayout.print(arialBold1, memberX, memberY, { text: memberText, bold: true });
    
      // Save the resulting image as PNG
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, "");
      const fileName = `${currentDate}${timestamp}_${first_name}_${last_name}.png`;
      const newFilePath = path.join('id', fileName);
      idLayout.write(newFilePath);
    
      pictureDirectory = newFilePath;
    }

    let newSignaturePath = null; // Initialize the new signature path

    if (req.files.signature && req.files.signature.length > 0) {
      // Resize the picture
      const sign = await Jimp.read(req.files.signature[0].path);
      sign.resize(867, 122);
    
      // Load the ID layout image
      const signLayoutPath = path.join(__dirname, '..', '..', 'sign_layout', 'sign_layout.png');
      const signLayout = await Jimp.read(signLayoutPath);
    
      // Place the picture on top of the ID layout image
      const signx = 82;
      const signy = 86;
      signLayout.composite(sign, signx, signy);
    
      // Save the resulting image as PNG
      const currentSignDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const timesignstamp = new Date().toISOString().slice(11, 19).replace(/:/g, "");
      const signName = `${currentSignDate}${timesignstamp}_${first_name}_${last_name}_signature.png`;
      newSignaturePath = path.join('signature', signName);
      const newSignPath = path.join(__dirname, '..', '..', newSignaturePath); // Adjust the path to the appropriate directory
      signLayout.write(newSignPath);
    }
    

    const newPicture = new Picture({
  name: `${currentDate}_${first_name}_${last_name}`,
  first_name: first_name,
  last_name: last_name,
  middle_name: middle_name,
  description: email_add,
  email_add: email_add,
  picture_directory: pictureDirectory,
  id_directory: pictureDirectory,
  signature_directory: newSignaturePath,
  member_id: member_id
});
    
    // Save the new picture object to the database
    newPicture.save(err => {
      if (err) {
        return res.status(500).json({ message: 'Picture upload failed', error: err });
      }
    
      return res.status(200).json({ message: 'Picture uploaded successfully' });
    });
  });
}


const upload1 = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './attachments/');
    },
    filename: function(req, file, cb) {
      const { email_add } = req.body;
      const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, "");
      const suffix = file.fieldname === 'attachment_1' ? '_attachment_1' : (file.fieldname === 'attachment_2' ? '_attachment_2' : (file.fieldname === 'attachment_3' ? '_attachment_3' : ''));
      const newName = `${currentDate}${timestamp}_${email_add}${suffix}.jpg`;
      cb(null, newName);
    }
  })
}).fields([{ name: 'attachment_1', maxCount: 1 }, { name: 'attachment_2', maxCount: 1 }, { name: 'attachment_3', maxCount: 1 }]);

exports.uploadAttachments = (req, res) => {
  upload1(req, res, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    
    // Check if required fields are empty
    const requiredFields = ['email_add'];
    const missingFields = requiredFields.filter(field => !req.body[field] && !req.files[field]);
    if (missingFields.length) {
      return res.status(400).send(`The following fields are missing: ${missingFields.join(', ')}`);
    }

    console.log(req.files.attachment_1);
    console.log(req.files.attachment_2);
    console.log(req.files.attachment_3);

    const { email_add } = req.body;

    const newAttachment = new Picture({
      name: `${currentDate}_${email_add}`,
      description: email_add,
      attachment_1_directory: req.files.attachment_1 ? req.files.attachment_1[0].path : null,
      attachment_2_directory: req.files.attachment_2 ? req.files.attachment_2[0].path : null,
      attachment_3_directory: req.files.attachment_3 ? req.files.attachment_3[0].path : null,
      email_add: email_add
    });

    newAttachment.saveAttachments(function(err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          status: true,
          message: "Attachments uploaded successfully!",
          data: result
        });
      }
    });
  });
};


