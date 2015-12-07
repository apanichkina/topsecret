//     Shoma.js 0.0.1

//     (c) 2015 Shamil Makhmutov
//     Shoma may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://iShoma.com
;define(function () {

    $(document).ready(
        resizeEvent()
    );

    $(window).resize(function () {
        resizeEvent();
    });

    function resizeEvent() {
        $('#tv').width(window.innerWidth);
        $('#tv').height(window.innerHeight);
    }

});