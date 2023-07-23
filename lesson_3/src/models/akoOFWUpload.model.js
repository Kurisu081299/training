const dbConn = require('../../config/db.config');

const Picture = function(picture) {
  this.first_name = picture.first_name;
  this.last_name = picture.last_name;
  this.middle_name = picture.middle_name;
  this.email_add = picture.email_add;
  this.name = picture.name;
  this.description = picture.description;
  this.picture_directory = picture.picture_directory;
  this.signature_directory = picture.signature_directory;
  this.attachment_1_directory = picture.attachment_1_directory;
  this.attachment_2_directory = picture.attachment_2_directory;
  this.attachment_3_directory = picture.attachment_3_directory;
  this.id_directory = picture.id_directory;
  this.member_id = picture.member_id;

  this.save = function(result) {
    let sql = "UPDATE pictures SET first_name = ?, last_name = ?, middle_name = ?, name = ?, description = ?, picture_directory = ?, signature_directory = ?, id_directory = ? WHERE email_add = ?";
    let values = [this.first_name, this.last_name, this.middle_name, this.name, this.description, this.picture_directory, this.signature_directory, this.id_directory, this.email_add];

    if (!this.picture_directory) {
      // Exclude picture_directory from the update if it's empty
      sql = "UPDATE pictures SET first_name = ?, last_name = ?, middle_name = ?, name = ?, description = ?, signature_directory = ? WHERE email_add = ?";
      values = [this.first_name, this.last_name, this.middle_name, this.name, this.description, this.signature_directory, this.email_add];
    } else if (!this.signature_directory) {
      // Exclude signature_directory from the update if it's empty
      sql = "UPDATE pictures SET first_name = ?, last_name = ?, middle_name = ?, name = ?, description = ?, picture_directory = ?, id_directory = ? WHERE email_add = ?";
      values = [this.first_name, this.last_name, this.middle_name, this.name, this.description, this.picture_directory, this.id_directory, this.email_add];
    }

    dbConn.query(sql, values, function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.affectedRows + " record(s) updated");
        result(null, res.affectedRows);
      }
    });
  };
  


  this.findMemberId = function(result) {
    const sql = "SELECT member_id FROM pictures WHERE email_add = ?";
    dbConn.query(sql, [this.email_add], function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res[0].member_id);
        result(null, res[0].member_id);
      }
    });
  };


  this.saveAttachments = function(result) {
    const sql = "INSERT INTO attachments (email_add, attachment_1, attachment_2, attachment_3) VALUES (?, ?, ?, ?)";
    dbConn.query(sql, [this.email_add, this.attachment_1_directory, this.attachment_2_directory, this.attachment_3_directory], function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.insertId);
        result(null, res.insertId);
      }
    });
  };
};

module.exports = Picture;