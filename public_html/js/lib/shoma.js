;define(function () {

    var tv = $('#tv'),
        tvMain = $('#tv__main'),
        tvRight = $('#tv__right'),
        tvTop = $('#tv__top'),
        tvRightBtn = $('#tv__right__btn'),
        tvRightHs = $('#tv__right__hs'),
        desk = $('#desk'),
        clock = $('.clock'),
        dp10 = $('#dp10'),
        nintendo = $('#nintendo'),
        html = $('html');

    var tvWidth,
        tvHeight,
        tvBorder,
        tvRightWidth,
        tvRightHeight,
        tvRightBtnWidth,
        tvRightHsWidth,
        tvRightHsHeight,
        tvRightHsBorder,
        tvMainWidth,
        tvMainHeight,
        tvMainBorder,
        tvMainBorderRadius,
        tvTopWidth,
        tvTopHeight,
        clockD,
        dp10Width,
        nintendoWidth,nintendoHeight;

    var TVR = 16 / 9;
    var TVR_OLD = 3 / 2;

    // Задание текущего размера телека
    function tvSize() {
        if (windowIsPortr()) {
            tvWidth = windowWidth * 0.98;
            tvHeight = tvWidth / TVR;
        } else {
            tvHeight = windowHeight * 0.98;
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

        html.css({
            'font-size': tvMainHeight / 200
        });
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
                return (tvRightWidth - tvRightHsWidth - tvRightHsBorder) / 2;
            },
            'border-radius': tvRightHsBorder,
            'background-size': tvRightHsBorder
        })
    }

    function deskPosition() {
        desk.css({
            'height': function () {
                return (windowHeight - tvHeight) / 2 + tvHeight / 3;
            }
        });
    }

    $(document).ready(function () {
        resizeEvent();
        initClock();
        moveSecondHands();
        setUpMinuteHands()
    });

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
        clockSize();
        clockPosition();
        dp10Size();
        dp10Position();
        nintendoSize();
        nintendoPosition();
    }

    // Возвращает 1, если размер окна браузера ближе к портретной ориентации
    function windowIsPortr() {
        return windowHeight * TVR > windowWidth;
    }

    var windowWidth;
    var windowHeight;

    function initClock() {
        var date = new Date;
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        var hands = [
            {
                hand: 'clock__hours',
                angle: (hours * 30) + (minutes / 2)
            },
            {
                hand: 'clock__minutes',
                angle: (minutes * 6)
            },
            {
                hand: 'clock__seconds',
                angle: (seconds * 6)
            }
        ];
        for (var j = 0; j < hands.length; j++) {
            var elements = document.querySelectorAll('.' + hands[j].hand);
            for (var k = 0; k < elements.length; k++) {
                elements[k].style.webkitTransform = 'rotateZ(' + hands[j].angle + 'deg)';
                elements[k].style.transform = 'rotateZ(' + hands[j].angle + 'deg)';
                if (hands[j].hand === 'minutes') {
                    elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
                }
            }
        }
    }

    function setUpMinuteHands() {
        var containers = document.querySelectorAll('.clock__cminutes');
        var secondAngle = containers[0].getAttribute("data-second-angle");
        if (secondAngle > 0) {
            var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
            setTimeout(function () {
                moveMinuteHands(containers);
            }, delay);
        }
    }

    function moveMinuteHands(containers) {
        for (var i = 0; i < containers.length; i++) {
            containers[i].style.webkitTransform = 'rotateZ(6deg)';
            containers[i].style.transform = 'rotateZ(6deg)';
        }

        setInterval(function () {
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].angle === undefined) {
                    containers[i].angle = 12;
                } else {
                    containers[i].angle += 6;
                }
                containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
                containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
            }
        }, 60000);
    }

    function moveSecondHands() {
        var containers = document.querySelectorAll('.clock__cseconds');
        setInterval(function () {
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].angle === undefined) {
                    containers[i].angle = 6;
                } else {
                    containers[i].angle += 6;
                }
                containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
                containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
            }
        }, 1000);
    }

    function clockSize() {
        clockD = tvHeight / 2.5;
        clock.width(clockD);
        clock.height(clockD)
    }

    function clockPosition() {
        clock.css({
            'top': function () {
                return (windowHeight - 2.2 * tvHeight - clockD) / 2;
            },
            'left': function () {
                return (windowWidth - clockD) / 2;
            }
        })
    }

    function dp10Size() {
        dp10Width = tvHeight / 3;
        dp10.width(dp10Width);
        dp10.height(dp10Width);
    }

    function dp10Position() {
        dp10.css({
            'top': function () {
                return (windowHeight - tvHeight) / 3;
            },
            'left': function () {
                return (windowWidth - tvWidth * 1.5) / 3;
            },
            'border-size': dp10Width / 20
        });
    }

    function nintendoSize() {
        nintendoWidth = tvWidth / 2;
        nintendoHeight = nintendoWidth / 3;
        nintendo.width(nintendoWidth);
        nintendo.height(nintendoHeight);
    }

    function nintendoPosition() {
        nintendo.css({
            'bottom': function () {
                return (windowHeight - tvHeight * 2) / 3;
            },
            'left': function () {
                return (windowWidth - clockD - nintendoWidth) / 2;
            }
        })
    }

});