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

$(window).trigger("orientationchange");

$(document).ready(function(){

    var ws = new WebSocket("ws://"+window.location.host+"/game/");

    ws.onmessage = function(data){
        console.log(data);
    };

    $()

});