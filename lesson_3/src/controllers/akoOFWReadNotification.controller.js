const Notification = require("../models/akoOFWReadNotification.model");

exports.readNotification = (req, res) => {
  const { email_add } = req.query;

  Notification.getByEmail(email_add, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      // No notifications found for the email
      return res.status(200).json({ message: "No notifications found for this email" });
    } else {
      // Found notification, return the status and notification details
      const notifications = results.map(notification => {
        return {
          notif_id: notification.notif_id,
          title: notification.title,
          body: notification.body
        };
      });
      return res.status(200).json(notifications);
    }
  });
};

exports.updateStatus = (req, res) => {
  const { email_add, notif_id } = req.query;

  Notification.updateStatus(email_add, notif_id, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      // No notifications found for the email and notif_id
      return res.status(200).json({ message: "No notifications found for this email and notif_id" });
    } else {
      // Status updated successfully
      return res.status(200).json({ message: "Status updated successfully" });
    }
  });
};

exports.updateAllStatus = (req, res) => {
  const { email_add } = req.query;

  Notification.updateAllStatus(email_add, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      // No notifications found for the email or already updated
      return res.status(200).json({ message: "No pending notifications found for this email" });
    } else {
      // Updated notification status
      return res.status(200).json({ message: "Notification status updated to read" });
    }
  });
};
