const dbConn = require("../../config/db.config");
const Login = require("../models/akoOFWLogin.model");
const Saklolo = require("../models/akoOFWHindiMabuti.model");
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

exports.createSaklolo = function(req, res) {
  // Check if required fields are provided
  if (!req.body.email_add || !req.body.reason || !req.body.message || !req.body.first_name || !req.body.last_name || !req.body.contactnum || !req.body.address_abroad || !req.body.cur_country) {
    res.status(400).send({
      error: true,
      message: "Please provide reason, message",
    });
  } else {
    const newSaklolo = new Saklolo({
      email_add: req.body.email_add,
      reason: req.body.reason,
      message: req.body.message,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      middle_name: req.body.middle_name,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      contactnum: req.body.contactnum,
      fb_name: req.body.fb_name,
      agency: req.body.agency,
      occupation: req.body.occupation,
      address_abroad: req.body.address_abroad,
      cur_country: req.body.cur_country,
      relative: req.body.relative,
      relative_num: req.body.relative_num,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    });

    // Call the Saklolo model's create method to save the newSaklolo object to the database
    Saklolo.create(newSaklolo, function(err, saklolo) {
      if (err) res.send(err);
      else {
        // Define the campaign settings
        const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
        emailCampaigns.name = "Campaign sent via the API";
        emailCampaigns.subject = "Saklolo Message";
        emailCampaigns.sender = {"name": `${req.body.first_name} ${req.body.last_name}`, "email":"developer@talaghay.com"};
        emailCampaigns.type = "classic";
        // Content that will be sent
        const googlemaps= `https://www.google.com/maps/search/?api=1&query=${req.body.latitude},${req.body.longitude}`;
        const htmlContent = `<p>Dear ${req.body.first_name} ${req.body.last_name},</p><p>Thank you for contacting us. We have received your condition in you workplace and will get back to you as soon as possible.</p><p>Reason: ${req.body.reason}</p><p>Message: ${req.body.message}</p><p>First Name: ${req.body.first_name}</p><p>Last Name: ${req.body.last_name}</p><p>Middle Name: ${req.body.middle_name}</p><p>Birthdate: ${req.body.birthdate}</p><p>Gender: ${req.body.gender}</p><p>Contact Number: ${req.body.contactnum}</p><p>Facebook Name: ${req.body.fb_name}</p><p>Agency: ${req.body.agency}</p><p>Occupation: ${req.body.occupation}</p><p>Address Abroad: ${req.body.address_abroad}, ${req.body.cur_country}</p><p>Relative: ${req.body.relative}</p><p>Relative Number: ${req.body.relative_num}</p><p>Email Address: ${req.body.email_add}</p> Location: <a href="${googlemaps}">View on Google Maps</a></p><p>Best regards,<br>The AkoOFW Team</p>`;
        emailCampaigns.htmlContent = htmlContent;
        // Select the recipients
        emailCampaigns.recipients = {listIds: [2]
          ,to: [{email: req.body.email_add}, {email: 'developer@talaghay.com'}]
        };

        const now = new Date();
        const scheduledDate = new Date(now.getTime() + 1 * 1000); // 5 minutes from now
        const scheduledDateUtc = scheduledDate.toISOString() // Convert to ISO string format
            // Set the campaign's scheduled date
    emailCampaigns.scheduledAt = scheduledDateUtc;

    // Call the API to create the campaign
    apiInstance.createEmailCampaign(emailCampaigns).then(function(data) {
      // Log the response from the API
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      // Send a success response to the client
      res.send({
        error: false,
        message: "Condition sent!",
        data: saklolo
      });
    }, function(error) {
      console.error(error);
      // Send an error response to the client
      res.send({
        error: true,
        message: "An error occurred while creating the email campaign: " + error.message
      });
    });
  }
});
}
};


