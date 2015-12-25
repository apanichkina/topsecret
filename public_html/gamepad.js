/**
 * Created by shamilmakhmutov on 24.12.15.
 */
var Orientation = {
    PORTRAIT: 0,
    LANDSCAPE: 1
};

function resizeEvent(newOrientation) {
    var MAGIC_NUMBER = 100;
    var $html = $('html'),
        fontSize;

    if (newOrientation == Orientation.PORTRAIT) {
        fontSize = window.innerWidth / MAGIC_NUMBER;
    } else {
        fontSize = window.innerHeight / MAGIC_NUMBER;
    }

    $html.css({
        'font-size': fontSize
    });
}

function redraw(newOrientation) {
    var $gamepad = $('.gamepad');

    var toPortrait = function () {
        $gamepad.removeClass('gamepad_landscape').addClass('gamepad_portrait');
    };

    var toLandscape = function () {
        $gamepad.removeClass('gamepad_portrait').addClass('gamepad_landscape');
    };

    if (newOrientation === Orientation.LANDSCAPE) {
        toLandscape();
    } else {
        toPortrait();
    }
    resizeEvent(newOrientation);
}

$(window).on("orientationchange", function (event) {
    if (event.orientation === 'portrait') {
        redraw(Orientation.PORTRAIT);
    } else {
        redraw(Orientation.LANDSCAPE);
    }
});

function Transport (auth_code) {

    this.ws = new WebSocket("ws://" + window.location.host + "/mobile/?pass="+auth_code);

    this.ws.onmessage = function (data) {
        console.log(data);
    };

}

Transport.prototype.send = function (data) {
    this.ws.send(JSON.stringify(data));
};

$(window).trigger("orientationchange");

$(document).ready(function () {

    var queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

    var ws = new Transport(queryDict['pass']);
    $('.js-up').on('tap', function () {
        ws.send({code: 7});
    });

    $('.js-down').on('tap', function () {
        ws.send({code: 6});
    });

    $('.js-left').on('tap', function () {
        ws.send({code: 5});
    });

    $('.js-right').on('tap', function () {
        ws.send({code: 4});
    });

});