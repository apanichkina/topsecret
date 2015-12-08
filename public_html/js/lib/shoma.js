//     Shoma.js 0.0.1
//
//     (c) 2015 Shamil Makhmutov
//     Shoma may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://iShoma.com

;define(function () {

    var tv = $('#tv');
    var tvMain = $('#tv__main');
    var tvRight = $('#tv__right');
    var tvTop = $('#tv__top');
    var tvRightBtn = $('#tv__right__btn');
    var tvRightHs = $('#tv__right__hs');
    var desk = $('#desk');

    var tvWidth;
    var tvHeight;
    var tvBorder;

    var tvRightWidth;
    var tvRightHeight;

    var tvRightBtnWidth;

    var tvRightHsWidth;
    var tvRightHsHeight;
    var tvRightHsBorder;

    var tvMainWidth;
    var tvMainHeight;
    var tvMainBorder;
    var tvMainBorderRadius;

    var tvTopWidth;
    var tvTopHeight;

    var TVR = 16 / 9;
    var TVR_OLD = 3 / 2;

    // Задание текущего размера телека
    function tvSize() {
        if (windowIsPortr()) {
            tvWidth = windowWidth * 0.95;
            tvHeight = tvWidth / TVR;
        } else {
            tvHeight = windowHeight * 0.95;
            tvWidth = tvHeight * TVR;
        }
        tv.width(tvWidth);
        tv.height(tvHeight);
    }

    // Задание бордера для телека
    function tvBorderSize() {
        tvBorder = Math.round(tvWidth / 100);
        tv.css('border-width', tvBorder);
    }

    // Позиционирование телека на экране
    function tvPosition() {
        tv.css({
            'top': function () {
                return (windowHeight - tvHeight - 2 * tvBorder ) / 2;
            },
            'left': function () {
                return (windowWidth - tvWidth - 2 * tvBorder ) / 2;
            }
        });
    }

    function tvMainSize() {
        tvMainHeight = tvHeight * 0.95;
        tvMainWidth = tvMainHeight * TVR_OLD;

        tvMain.height(tvMainHeight);
        tvMain.width(tvMainWidth);
    }
    function tvMainBorderSize() {
        tvMainBorder = tvMainWidth / 200;
        tvMainBorderRadius = tvMainBorder * 2;
        tvMain.css({
            'border-width': tvMainBorder,
            'border-radius': tvMainBorderRadius
        });
    }

    function tvMainPosition() {
        tvMain.css({
            'top': function () {
                return (tvHeight - tvMainHeight - 2 * tvMainBorder ) / 2;
            },
            'left': function () {
                return (tvWidth - tvMainWidth - tvRightWidth - 2 * tvMainBorder ) / 2;
            }
        });
    }

    function tvRightSize() {
        tvRightHeight = tvHeight;
        tvRightWidth = tvWidth / 7;
        tvRight.width(tvRightWidth);
        tvRight.height(tvRightHeight);
    }

    function tvTopSize() {
        tvTopWidth = tvWidth * 0.4;
        tvTopHeight = tvTopWidth / 2;
        tvTop.width(tvTopWidth);
        tvTop.height(tvTopHeight);
    }

    function tvTopPosition() {
        tvTop.css({
            'top': function () {
                return -tvTopHeight - tvBorder;
            },
            'left': function () {
                return (tvWidth - tvTopWidth) / 2;
            }
        })
    }

    function tvRightBtnSize() {
        tvRightBtnWidth = tvRightWidth * 0.7;
        tvRightBtn.width(tvRightBtnWidth);
        tvRightBtn.height(tvRightBtnWidth);
    }

    function tvRightBtnPosition() {
        tvRightBtn.css({
            'top': function () {
                return tvRightBtnWidth / 2;
            },
            'left': function () {
                return (tvRightWidth - tvRightBtnWidth) / 2;
            }
        })
    }

    function tvRightHsSize() {
        tvRightHsWidth = tvRightWidth * 0.8;
        tvRightHsHeight = tvRightHeight * 0.55;
        tvRightHs.width(tvRightHsWidth);
        tvRightHs.height(tvRightHsHeight);
        tvRightHsBorder = tvRightHsWidth / 15;
    }

    function tvRightHsPosition() {
        tvRightHs.css({
            'top': function () {
                return tvRightBtnWidth * 2;
            },
            'left': function () {
                return (tvRightWidth - tvRightHsWidth -  tvRightHsBorder) / 2;
            },
            'border-radius': tvRightHsBorder,
            'background-size': tvRightHsBorder / 2
        })
    }

    function  deskPosition() {
        desk.css({
            'height': function() {
                return (windowHeight - tvHeight) / 2 + tvHeight / 3;
            }
        });
    }

    $(document).ready(
        resizeEvent()
    );

    $(window).resize(function () {
        resizeEvent();
    });

    function windowSize() {
        windowHeight = window.innerHeight;
        windowWidth = window.innerWidth;
    }

    function resizeEvent() {
        windowSize();
        tvSize();
        tvBorderSize();
        tvPosition();
        tvRightSize();
        tvTopSize();
        tvTopPosition();
        tvRightBtnSize();
        tvRightBtnPosition();
        tvRightHsSize();
        tvRightHsPosition();
        tvMainSize();
        tvMainBorderSize();
        tvMainPosition();
        deskPosition();
    }

    // Возвращает 1, если размер окна браузера ближе к портретной ориентации
    function windowIsPortr() {
        return windowHeight * TVR > windowWidth;
    }

    var windowWidth;
    var windowHeight;

});