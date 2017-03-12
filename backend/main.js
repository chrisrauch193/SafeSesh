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

app.use(bodyParser.json());

app.use(express.static("test_public"));

let trackers = {};

app.post("/start", function(req, res) {
    console.log("Session: " + JSON.stringify(req.session));
    console.log("Body: " + JSON.stringify(req.body));

    let accId = req.body.account_id;
    if(accId in trackers) {
        console.log(`Account id ${accId} already in trackers`);
        res.sendStatus(400);
    }
    else {
        let secretToken = req.body.secret_token;
        let amount = req.body.amount;
        trackers[accId] = new Tracker(secretToken, accId, amount*100);
        trackers[accId].registerWebHook();
        req.session.account_id = accId;
        res.sendStatus(200);
    }
});

app.get("/amountleft", function(req, res) {
    var acc_id = req.query.account_id;
});

app.post("/hookhandle", function(req, res) {
    console.log("Body: " + JSON.stringify(req.body));
    let account_id = req.body.data.account_id;
    if(!(account_id in trackers)) {
        console.log("Got callback from something not in our tracker");
        res.sendStatus(400);
    }
    else {
        let tracker = trackers[account_id];
        if(req.body.data.counterparty.number == "+447716292939") {
            console.log("Drinking logged");
            console.log("This costed £" + req.body.data.amount)
            tracker.updateMoney(req.body.data.amount);
        }
    }
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
