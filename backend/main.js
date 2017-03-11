const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

const app = express();
const Tracker = require("./tracker.js");

app.set('trust proxy', 1);

app.use(cookieSession({
    name: "SafeSeshSesh",
    keys: ["magical secret key", "other magical secret key"],

    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.get("/", function(req,res) {
    res.send("Works");
    res.end(200);
});

app.use(bodyParser.json());

let trackers = {};

app.post("/start", function(req, res) {
    console.log("Session: " + JSON.stringify(req.session));
    console.log("Body: " + JSON.stringify(req.body));

    let accId = req.body.account_id;
    let secretToken = req.body.secret_token;
    if(accId in trackers) {
        res.sendStatus(400);
    }
    else {
        trackers[accId] = new Tracker(secretToken, accId);
        trackers[accId].registerWebHook();
        req.session.account_id = accId;
        res.sendStatus(200);
    }
});

app.post("/hookEndPoint", function(req, res) {
    let account_id = app.body.data.account_id;
    if(!(account_id in trackers)) {
        console.err("Got callback from something not in our tracker");
        res.sendStatus(400);
    }
    else {
        let tracker = trackers(account_id);
        if(app.body.data.counterparty.number == "+447716292939") {
            console.log("Drinking logged");
        }
    }
});

app.post("/monzoMock", function(req, res) {
     console.log("Webhook received: " + JSON.stringify(req.body));
     res.sendStatus(200);
});

app.post("/quit", function(req, res) {
    if(req.body.sec_key == "Darude Sandstorm") {
        res.sendStatus(200);
        server.close();
    }
    else {
        res.sendStatus(400);
    }
});

var server = app.listen(45454, function() {
    console.log("Safe sesh started listening...");
})
