const dbConn = require("../../config/db.config");

const Picture = function(picture) {
  this.first_name = picture.first_name;
  this.last_name = picture.last_name;
  this.email_add = picture.email_add;
  this.picture_directory = picture.picture_directory;
  this.signature_directory = picture.signature_directory;
  this.id_directory = picture.id_directory;
  this.description = picture.description;
  this.name = picture.name;
};

Picture.findOne = (email_add, result) => {
  dbConn.query("SELECT * FROM pictures WHERE email_add = ?", [email_add], function(err, res) {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log(`Found picture for email_add: ${email_add}`);
      const picture = new Picture({
        first_name: res[0].first_name,
        last_name: res[0].last_name,
        email_add: res[0].email_add,
        picture_directory: res[0].picture_directory,
        signature_directory: res[0].signature_directory,
        id_directory: res[0].id_directory,
        description: res[0].description,
        name: res[0].name
      });
      result(null, picture);
      return;
    }

    console.error(`Picture not found for email_add: ${email_add}`);
    // Picture not found
    result({ kind: "not_found" }, null);
  });
};

module.exports = Picture;
