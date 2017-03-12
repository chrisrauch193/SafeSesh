const request = require("request");
// request.debug = true;

const hookPoint = "http://ungurianu.com/safesesh/hookhandle/";

class Tracker {
    constructor(token, accId, moneyToSpend) {
        this.token = token;
        this.accId = accId;
        this.moneyToSpend = moneyToSpend;
    }

    updateMoney(by) {
        this.moneyToSpend += by;
    }

    registerWebHook() {
        let printBody = (err, res, body) => {
            console.log("Body: " + body);
        }

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
