const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS module
const app = express();
const port = process.env.PORT || 3001;
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use('/images', express.static(__dirname + '/tmp'));
console.log(`express.static: ${__dirname + '/tmp'}`);

app.use((req, res, next) => {
  console.log(`Requested URL: ${req.url}`);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add CORS middleware
app.use(cors());

app.get("/", (req, res) => {
  res.send("It's working");
});

// routes should be here
const akoOFWSignRoute = require("./src/routes/akoOFWSign.route");
const akoOFWLoginRoute = require("./src/routes/akoOFWLogin.route")
const akoOFWSakloloRoute = require("./src/routes/akoOFWSaklolo.route")
const akoOFWHindiMabutiRoute = require("./src/routes/akoOFWHindiMabuti.route")
const akoOFWUploadRoute = require("./src/routes/akoOFWUpload.route")
const akoOFWGetPictureRoute = require("./src/routes/akoOFWGetPicture.route")
const akoOFWPushNotificationRoute = require("./src/routes/akoOFWPushNotification.route")
const akoOFWResetPassRoute = require("./src/routes/akoOFWResetPass.route")
const akoOFWDeleteDeviceTokenRoute = require("./src/routes/akoOFWDeleteDeviceToken.route")
const akoOFWReadNotificationRoute = require("./src/routes/akoOFWReadNotification.route")
const akoOFWPasswordRoute = require("./src/routes/akoOFWPassword.route")

//middlewares here
app.use("/api/v1/signup", akoOFWSignRoute)
app.use("/api/v1/login", akoOFWLoginRoute)
app.use("/api/v1/saklolo", akoOFWSakloloRoute)
app.use("/api/v1/hindimabuti", akoOFWHindiMabutiRoute)
app.use("/api/v1/upload", akoOFWUploadRoute)
app.use("/api/v1/getpicture", akoOFWGetPictureRoute)
app.use("/api/v1/pushnotification", akoOFWPushNotificationRoute)
app.use("/api/v1/resetpassword", akoOFWResetPassRoute)
app.use("/api/v1/deletedevicetoken", akoOFWDeleteDeviceTokenRoute)
app.use("/api/v1/readnotification", akoOFWReadNotificationRoute)
app.use("/api/v1/", akoOFWPasswordRoute)


//port listening
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
module.exports = app;
