const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port =  3009;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("It's working");
  });


  // routes
const signUpRoute = require("./route/signUpRoute");

//middleware
app.use("/api/v1/signup", signUpRoute)

   //port listening
   app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  module.exports = app;
