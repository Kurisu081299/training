const dbConn = require("../../config/db.config");

const Notification = function(notification) {
  this.email_add = notification.email_add;
  this.status = notification.status;
};

Notification.getByEmail = function(email, result) {
  dbConn.query("SELECT * FROM notifications WHERE email_add = ? AND status = 'pending'", email, function(err, res) {
    if (err) {
      console.error("Error selecting notification:", err);
      return result(err, null);
    }

    if (res.length === 0) {
      console.log("No notifications found with email: " + email);
      return result(null, []);
    }

    console.log("Found notifications:", res);
    return result(null, res);
  });
};

Notification.updateStatus = function(email, notif_id, result) {
  dbConn.query("UPDATE notifications SET status = 'read' WHERE email_add = ? AND notif_id = ?", [email, notif_id], function(err, res) {
    if (err) {
      console.error("Error updating notification status:", err);
      return result(err, null);
    }

    console.log("Status updated successfully:", res);
    return result(null, res);
  });
};

Notification.updateAllStatus = function(email, result) {
  dbConn.query("UPDATE notifications SET status = 'read' WHERE email_add = ? AND status = 'pending'", email, function(err, res) {
    if (err) {
      console.error("Error updating notification:", err);
      return result(err, null);
    }

    console.log("Updated notifications:", res.affectedRows);

    return result(null, res);
  });
};


module.exports = Notification;
