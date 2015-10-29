/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/game',
    'models/user'
], function (Backbone,
             tmpl,
             userModel) {

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,


        initialize: function () {
            $('#page').append(this.el);
            this.render();
        },
        render: function () {
            this.$el.html(this.template);

            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();

            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');
            var width = window.innerWidth;
            var height = window.innerHeight;
            this.canvas.width = width;
            this.canvas.height = height;

            this.container = {x: 0, y: 0, width: width, height: height};

            this.imageObj = new Image();
            this.imageObj.src = "../../img/football_field.jpg";

            this.imageObjBall = new Image();
            this.imageObjBall.src = "../../img/ball.jpg";

            this.imageObjHead = new Image();
            this.imageObjHead.src = "../../img/head.png";

            this.balls = [];
            this.myArc = {
                x: 50,
                y: this.canvas.height / 2,
                radius: 20,
                Vx: 0,
                Vy: 0
            };
            this.myArc2 = {
                x: this.container.width - 50,
                y: this.canvas.height / 2,
                radius: 20,
                Vx: -0,
                Vy: 0
            };
            this.ball = {
                x: this.container.width / 2,
                y: this.canvas.height / 2,
                radius:10,
                Vx: 5,
                Vy: 5
            };
            this.balls.push(this.myArc);
            this.balls.push(this.myArc2);
            window.onkeydown = this.processKey.bind(this);

            this.drawArc(this.myArc, this.context);
            this.animate();
        },
        show: function () {
            console.log(this.user.logged_in);
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        },


        //helpers

        onload: function () {
            var container = this.container;
            var imageObj = this.imageObj;
            this.context.drawImage(imageObj, container.x, container.y, container.width, container.height);
        },
        animate: function () {
            this.context.fillStyle = this.onload();
            for(var i=0; i < this.balls.length; i++) {
                var myArc = this.balls[i];

                if ((myArc.x + myArc.Vx + myArc.radius > this.container.x + this.container.width) || (myArc.x - myArc.radius + myArc.Vx < this.container.x)) {
                    myArc.Vx = -myArc.Vx;
                }
                if ((myArc.y + myArc.Vy + myArc.radius > this.container.y + this.container.height) || (myArc.y - myArc.radius + myArc.Vy < this.container.y)) {
                    myArc.Vy = -myArc.Vy;
                }
                myArc.x += myArc.Vx;
                myArc.y += myArc.Vy;

                this.drawArc(myArc, this.context);
            }
            requestAnimFrame(this.animate.bind(this));


        },
        drawArc: function (myArc, context) {
            context.save();
            context.beginPath();
            context.translate(myArc.x, myArc.y);
            var imgW = myArc.radius * 2;
            var imgH = myArc.radius * 2;
            context.rotate(Math.atan2(myArc.Vy, myArc.Vx) - Math.PI / 2);
            var grd = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);
            context.fillStyle = grd;
            context.fill();
            context.restore();
        },
        drawBall: function (ball, context) {
            context.save();
            context.beginPath();
            context.translate(ball.x, ball.y);
            var imgW = ball.radius * 2;
            var imgH = ball.radius * 2;
            context.rotate(Math.atan2(ball.Vy, ball.Vx) - Math.PI / 2);
            var grd = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);
            context.fillStyle = grd;
            context.fill();
            context.restore();
        },
        processKey: function (e) {
            if (e.keyCode == 37) {
                this.myArc.Vx -= 1;
            }
            if (e.keyCode == 39) {
                this.myArc.Vx += 1;
            }
            if (e.keyCode == 38) {
                this.myArc.Vy -= 1;
            }
            if (e.keyCode == 40) {
                this.myArc.Vy += 1;
            }

            if (e.keyCode == 65) {
                this.myArc2.Vx -= 1;
            }
            if (e.keyCode == 68) {
                this.myArc2.Vx += 1;
            }
            if (e.keyCode == 87) {
                this.myArc2.Vy -= 1;
            }
            if (e.keyCode == 83) {
                this.myArc2.Vy += 1;
            }

        }
    });

    return new View();
});