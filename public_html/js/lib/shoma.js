//     Shoma.js 0.0.1

//     (c) 2015 Shamil Makhmutov
//     Shoma may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://iShoma.com

;define(function () {

    var tv = $('#tv');

    var tvWidth = 100;
    var tvHeight = 100;

    function tvSize() {
        if (windowIsPortr()){
            tvWidth = windowWidth;
            tvHeight = tvWidth / 16 * 9;
        } else {
            tvHeight =windowHeight;
            tvWidth= tvHeight * 16 / 9;
        }
        tv.width(tvWidth);
        tv.height(tvHeight);
    }

    $(document).ready(
        resizeEvent()
    );

    $(window).resize(function () {
        resizeEvent();
    });

    function resizeEvent() {
        windowHeight = window.innerHeight;
        windowWidth = window.innerWidth;
        tvSize();
    }

    function windowIsPortr() {
        return windowHeight * 16 / 9 > windowWidth;
    }

    var windowWidth;
    var windowHeight;

});