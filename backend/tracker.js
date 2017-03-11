const request = require("request");

class Tracker {
    constructor(token, accId, moneyToSpend) {
        this.token = token;
        this.accId = this.accId;
        this.moneyToSpend = moneyToSpend;
    }

    registerWebHook() {
        request.post('http://localhost:45454/monzoMock', {
            // 'auth': {
            //     'bearer':this.token
            // },
            'form': {
                'url':'place on the internet',
                'account_id':this.accId
            }
        })
    }
}

module.exports = Tracker;
