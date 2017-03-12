const request = require("request");
// request.debug = true;

const hookPoint = "http://ungurianu.com/safesesh/hookhandle/";

const printBody = (err, res, body) => {
    console.log("Body: " + body);
}

class Tracker {
    constructor(token, accId, moneyToSpend) {
        this.token = token;
        this.accId = accId;
        this.moneyToSpend = moneyToSpend;
    }

    updateMoney(by) {
        this.moneyToSpend += by;
        console.log("Current money: " + this.moneyToSpend)
        if(this.moneyToSpend <= 0) {
            notifyUser();
        }
    }

    notifyUser() {
        console.log("Sending notification...");
        request.post({
            url:"https://api.monzo.com/feed",
            form: {
                account_id:this.accId,
                type:"basic",
                "params[title]":"Stop drinking, you idiot",
                "params[image_url]":"https://media.giphy.com/media/6vWVzDv19i3MQ/giphy.gif",
                "params[background_color]":"#FCF1EE",
                "params[body_color]":"#FCF1EE",
                "params[title_color]":"#333",
                "params[body]":"You should go home, buddy"
            },
            auth: {
                bearer:this.token
            }
        },printBody);
    }

    registerWebHook() {

        let addHookIfNotFound = (err, res, body) => {
            let webhooks = JSON.parse(body).webhooks;

            let found = false;
            for(let i = 0; i < webhooks.length; ++i) {
                if(webhooks[i].url == hookPoint) {
                    found = true;
                    break;
                }
            }

            if(!found) {
                console.log("Adding hook...");
                request.post({
                    url:'https://api.monzo.com/webhooks',
                    auth: {
                        'bearer':this.token
                    },
                    form:{
                        'account_id':this.accId,
                        'url':hookPoint,
                    }
                }, printBody);
            }
            else {
                console.log("Hook already found...");
            }
        };

        request.get({
            url:'https://api.monzo.com/webhooks',
            auth: {
                bearer:this.token,
            },
            qs: {
                'account_id':this.accId
            }
        }, addHookIfNotFound);
    }
}

module.exports = Tracker;
