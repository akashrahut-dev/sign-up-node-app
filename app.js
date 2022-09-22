const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const { response } = require("express");
const { STATUS_CODES } = require("http");

//static folder
app.use(express.static("public"));

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//locate the folder
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Singup.html");
});

app.post("/", (req, res) => {
  const FirstName = req.body.fName;
  const LastName = req.body.lName;
  const email = req.body.email;

  const Data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: FirstName,
          LNAME: LastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(Data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/a1a47abef3";
  const options = {
    method: "POST",
    auth: "Akash:cdfde4fa5b10de5025315e147d314fda-us11",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else res.sendFile(__dirname + "/failure.html");

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${3000}`);
});
