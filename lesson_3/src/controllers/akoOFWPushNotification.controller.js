const admin = require("../firebaseAdmin");
const Login = require("../models/akoOFWLogin.model");
const dbConn = require("../../config/db.config");

exports.sendNotification = async (req, res) => {
  const { message } = req.body;
  const notificationOptions = {
    notification: {
      title: message.title,
      body: message.body,
    },
    data: {
      title: message.title,
      body: message.body,
    },
  };

  try {
    // Fetch all emails and device tokens
    Login.allEmails((error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        // Extract the unique device tokens
        const deviceTokens = [...new Set(results.map((result) => result.device_token))];
        const emailAddresses = [...new Set(results.map((result) => result.email_add))];

        // Send the notification to all unique device tokens
        admin.messaging().sendToDevice(deviceTokens, notificationOptions)
          .then((response) => {
            // Insert into the notifications table with pending status
            const values = emailAddresses.map((email, index) => [email, deviceTokens[index], message.title, message.body, 'pending']);
            dbConn.query('INSERT INTO notifications (email_add, device_token, title, body, status) VALUES ?', [values], (error, result) => {
              if (error) {
                res.status(500).json({ error: error.message });
              } else {
                res.status(200).json(response);
              }
            });
          })
          .catch((error) => {
            res.status(500).json({ error: error.message });
          });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.sendSpecificNotification = async (req, res) => {
  const { message, device_token } = req.body;
  const notificationOptions = {
    notification: {
      title: message.title,
      body: message.body,
    },
    data: {
      title: message.title,
      body: message.body,
    },
  };

  try {
    if (device_token) {
      // Get the email_add for the device_token
      dbConn.query('SELECT email_add FROM user_details WHERE device_token = ?', [device_token], (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else {
          const email_add = results[0].email_add;

          // Send the notification to the specific device token
          admin.messaging().sendToDevice(device_token, notificationOptions)
            .then((response) => {
              // Insert into the notifications table with read status
              const values = [[email_add, device_token, message.title, message.body, 'pending']];
              dbConn.query('INSERT INTO notifications (email_add, device_token, title, body, status) VALUES ?', [values], (error, result) => {
                if (error) {
                  res.status(500).json({ error: error.message });
                } else {
                  res.status(200).json(response);
                }
              });
            })
            .catch((error) => {
              res.status(500).json({ error: error.message });
            });
        }
      });
    } else {
      // Fetch all device tokens
      Login.allDeviceTokens((error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else {
          // Extract the unique device tokens
          const deviceTokens = [...new Set(results.map((result) => result.device_token))];

          // Send the notification to all unique device tokens
          admin.messaging().sendToDevice(deviceTokens, notificationOptions)
            .then((response) => {
              // Insert into the notifications table with read status for each email_add
              const values = results.map((result) => [result.email_add, result.device_token, message.title, message.body, 'read']);
              dbConn.query('INSERT INTO notifications (email_add, device_token, title, body, status) VALUES ?', [values], (error, result) => {
                if (error) {
                  res.status(500).json({ error: error.message });
                } else {
                  res.status(200).json(response);
                }
              });
            })
            .catch((error) => {
              res.status(500).json({ error: error.message });
            });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
