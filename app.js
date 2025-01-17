const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "anystring:d61d564a7639cebfc188e09e9c062bcc-us17" 
    };

    const url = "https://us17.api.mailchimp.com/3.0/lists/1f62972bfb/members";

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(JSON.parse(data));
            if (response.statusCode === 200) {
                res.sendFile(__dirname+"/success.html");
            } else {
                res.sendFile(__dirname+"/failure.html");
            }
        });
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
