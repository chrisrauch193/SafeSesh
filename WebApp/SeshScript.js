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
    //$('html').css('background-color', '#296aff');
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
        //$('html').css('background-color', '#ff5044');
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

}

function buyDrink(transactionAmount) {
    spendingLimit -= transactionAmount;
    $('#spendingLimit').html("£" + spendingLimit);

    if (spendingLimit < 1) {
        canBuyDrinks = false;
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
    //$('html').css('background-color', '#ff5044');
    $('#attemptCount').html("Attempt: " + (playCount));
    gameMode = true;

    var time = Math.random() + 1;
    time = time * 3000;


    timer = setTimeout(function () {
        //$('html').css('background-color', '#57ff74');
        gameReadyToClick = true;
        createdTime = Date.now();
    }, time);
}

function judgeResult() {
    $('#winMessage').show();
    gameMode = false;
    gameReadyToClick = false;
    if (averageReactionTime < 0.5 && averageReactionTime > 0.1) {
        resetPage();
    } else {
        losePage();
    }
}

function losePage() {
    $('#input').hide();
    $('#sesh').hide();
    $('#limitReached').show();
    $('#game').hide();
    //$('html').css('background-color', '#296aff');
    $('#numOfTriesLeft').html("Attempts Left:" + numOfTries);
    if (numOfTries < 1) {
        $('#lossMessage').show();
        $('#startGameButton').hide();
    } else {
        numOfTries--;
    }
}