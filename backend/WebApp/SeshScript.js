/**
 * Created by Chris on 11/03/2017.
 */

var numOfTries = 3;

var startingBalance;
var spendingLimit;
var drinkCount;

var playCount = 0;
var reactionTimes = [];
var averageReactionTime = 0;
var canBuyDrinks = true;
var gameReadyToClick = false;
var createdTime = 0;
var clickedTime = 0;
var gameMode = false;
var missattempt = false;
var timer;

var USER_ID = "acc_00009CNhj7lD8LhVXxIhP7";
var SECRET_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0ODkzMTQ3NzQsImlhdCI6MTQ4OTI5MzE3NCwianRpIjoidG9rXzAwMDA5SUhJeG82ZDZiVFl2VzRYUnAiLCJ1aSI6InVzZXJfMDAwMDlBS200eEFNdlpnUFQ3U21iUiIsInYiOiIyIn0.w0VXRm8vLgfjocEO9n_yi8ojYn-jEcu2wqKFzfPKueg";

function resetPage() {
    startingBalance = 0;
    spendingLimit = 0;
    drinkCount = 0;
    playCount = 0;
    reactionTimes = [];
    averageReactionTime = 0;
    canBuyDrinks = true;
    gameReadyToClick = false;
    createdTime = 0;
    clickedTime = 0;
    gameMode = false;

    $('#input').show();
    $('#sesh').hide();
    $('#limitReached').hide();
    $('#game').hide();
    $('input.currency').currencyInput();
    $('#reactionTime').text(0);
    $('#game').css('background-color', 'white'); //Blue
    $('#loseMessage').hide();
}


(function($) {
    $.fn.currencyInput = function() {
        this.each(function() {
            var wrapper = $("<div class='currency-input' />");
            $(this).wrap(wrapper);
            $(this).before("<span class='currency-symbol'>$</span>");
            $(this).change(function() {
                var min = parseFloat($(this).attr("min"));
                var max = parseFloat($(this).attr("max"));
                var value = this.valueAsNumber;
                if(value < min)
                    value = min;
                else if(value > max)
                    value = max;
                $(this).val(value.toFixed(2));
            });
        });
    };
})(jQuery);

$(document).ready(function() {
    resetPage();
    $('#winMessage').hide();
    $('#lossMessage').hide();

});

function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
};

$('html').click(function () {
    if (gameMode && !gameReadyToClick) {
        if (playCount < 5) {
            playCount++;
            clearTimeout(timer);
            startGame();
        } else {
            clearTimeout(timer);
            judgeResult();
        }
    } else if (gameReadyToClick) {
        //$('html').css('background-color', '#ff5044'); //Red
        $('#game').css('background-color', '#ff5044');
        clickedTime = Date.now();

        reactionTimes.push((clickedTime - createdTime) / 1000);
        //reactionTimes.push((2000) / 1000);

        var sum = reactionTimes.reduce(function(a, b) { return a + b; }, 0);

        if (reactionTimes.length > 1) {
            var largest = arrayMax(reactionTimes);
            sum = sum - largest;
            averageReactionTime = sum / (reactionTimes.length - 1);
        } else {
            averageReactionTime = sum / reactionTimes.length;
        }


        $('#reactionTime').text(averageReactionTime);
        //$('#reactionTime').text(averageReactionTime.toString());
        //document.getElementById("printReactionTime").innerHTML="Your Reaction Time is: " + reactionTime + "seconds";
        gameReadyToClick = false;
        if (playCount < 5) {
            playCount++;
            startGame();
        } else {
            judgeResult();
        }
    }
});

function seshStart() {
    $('#input').hide();
    $('#sesh').show();
    $('#limitReached').hide();
    $('#game').hide();

    spendingLimit = $('#inputLimit').val();
    $('#spendingLimit').html("£" + spendingLimit);
    sendData();
    retriever();
}

function buyDrink(transactionAmount) {
    spendingLimit -= transactionAmount;
    $('#spendingLimit').html("£" + spendingLimit);

    if (spendingLimit < 1) {
        canBuyDrinks = false;
        $('#initMessage').hide();
        $('#input').hide();
        $('#sesh').hide();
        $('#limitReached').show();
        $('#game').hide();
        $('#loseMessage').hide();
        $('#numOfTriesLeft').html("Attempts Left:" + numOfTries);
    }
}

function startGame() {
    $('#input').hide();
    $('#sesh').hide();
    $('#limitReached').hide();
    $('#game').show();
    //$('html').css('background-color', '#ff5044'); //Red
    $('#game').css('background-color', '#ff5044');
    $('#attemptCount').html("Attempt: " + (playCount));
    gameMode = true;

    var time = Math.random() + 1;
    time = time * 3000;


    timer = setTimeout(function () {
        //$('html').css('background-color', '#57ff74'); //Green
        $('#game').css('background-color', '#57ff74');
        gameReadyToClick = true;
        createdTime = Date.now();
    }, time);
}

function judgeResult() {
    $('#winMessage').show();
    gameMode = false;
    gameReadyToClick = false;
    if (averageReactionTime < 0.5 && averageReactionTime > 0.1) {
      numOfTries = 3;
        resetPage();
    } else {
        losePage();
    }
}

function losePage() {
    resetPage();
    $('#input').hide();
    $('#sesh').hide();
    $('#limitReached').show();
    $('#game').hide();
    numOfTries--;
    //$('html').css('background-color', '#296aff'); //Blue
    $('#game').css('background-color', 'white');
    $('#numOfTriesLeft').html("Attempts Left:" + numOfTries);
    if (numOfTries < 1) {
        $('#lossMessage').show();
        $('#gameStartMessage').hide();
        $('#startGameButton').hide();
    }
}

function retriever() {
    //Do code here
    $.ajax( {
        url:"http://ungurianu.com/safesesh/amountleft?account_id=" + USER_ID,
        dataType:"json"
    },function(data, status) {
        spendingLimit = data.amount;
        //Code for when transaction is made
        $('#spendingLimit').html("£" + spendingLimit);
        if (spendingLimit < 1) {
            abortTimer();
            canBuyDrinks = false;
            $('#input').hide();
            $('#sesh').hide();
            $('#limitReached').show();
            $('#game').hide();
            $('#loseMessage').hide();
            $('#numOfTriesLeft').html("Attempts Left:" + numOfTries);
        }

        tid = setTimeout(retriever,2000);
    });
}
function abortTimer() { // to be called when you want to stop the timer
    clearTimeout(tid);
}

function sendData() {
    var amount = $("input[name=amount]").val();

    $.ajax( {   url:"http://ungurianu.com/safesesh/start",
                type:"POST",
                processData: false,
                contentType : 'application/json',
                data: JSON.stringify({
                    account_id:USER_ID,
                    secret_token:SECRET_TOKEN,
                    amount:spendingLimit | 0
                })
    });
}
