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
            var fieldW = 1397;
            var fieldH = 953;
            var width = window.innerWidth;
            this.coordinateStepX = width / fieldW;
            var height = window.innerHeight;
            this.coordinateStepY = height / fieldH;
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
                scaleX: this.x * this.coordinateStepX,
                y: fieldH / 2,
                scaleY: this.y * this.coordinateStepY,
                radius: 20,
                Vx: 0,
                scaleVx: this.Vx * this.coordinateStepX,
                Vy: 0,
                scaleVy: this.Vy + this.coordinateStepY,
                type: "human",
                borderColor: "red",
                isNotStop: function() {
                    return this.Vx + this.Vy;
                }
            };
            //TODO нужна ли модель игрока?

            this.myArc2 = {
                x: fieldW - 50,
                y: fieldH / 2,
                radius: 20 ,
                Vx: -0,
                Vy: 0,
                type: "human",
                isNotStop: function() {
                   return this.Vx + this.Vy;
                }
            };
            //TODO сделать как наследника
            this.ball = {
                x: fieldW / 2,
                y: fieldH / 2,
                radius: 10,
                Vx: 0,
                Vy: 0,
                type: "ball"
            };
            this.maxBallSpeed = 3;
            this.balls.push(this.ball);
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


        isCollision: function (i, j) { //проверить удар по касательной
            var a = parseFloat(this.balls[j].x) - parseFloat(this.balls[i].x);
            var b = parseFloat(this.balls[j].y) - parseFloat(this.balls[i].y);
            var distance = Math.sqrt(a * a + b * b);
            var minDistance = parseFloat(this.balls[j].radius) + parseFloat(this.balls[i].radius);
            return distance <= minDistance+1;
        },
        onload: function () {
            var container = this.container;
            var imageObj = this.imageObj;
            this.context.drawImage(imageObj, container.x, container.y, container.width, container.height);
        },
        animate: function () {
            this.context.fillStyle = this.onload();

            for (var i = 0; i < this.balls.length; i++) {
                var myArc = this.balls[i];
                this.drawArc(myArc, this.context);

                if (((myArc.x + myArc.Vx + myArc.radius) * this.coordinateStepX > this.container.x + this.container.width) || ((myArc.x - myArc.radius + myArc.Vx) * this.coordinateStepX < this.container.x)) {
                    myArc.Vx = -myArc.Vx;
                }
                if (((myArc.y + myArc.Vy + myArc.radius) * this.coordinateStepY > this.container.y + this.container.height) || ((myArc.y - myArc.radius + myArc.Vy) * this.coordinateStepY < this.container.y)) {
                    myArc.Vy = -myArc.Vy;
                }
                myArc.x += myArc.Vx;
                myArc.y += myArc.Vy;
            }
            for (var j = 1; j < this.balls.length; ++j) {
                for (var i = j - 1; i >= 0; --i) {

                    if (this.isCollision(i, j)) {
                        //if (this.balls[i].type == "ball") this.collision(i,j);
                        //else if (this.balls[j].type == "ball") this.collision(j,i);
                        this.collision(i,j);
                    }
                }
            }
            requestAnimFrame(this.animate.bind(this));


        },

        //TODO попробовать чтобы не останавливалсь
        //TODO попробовать с трением
        //TODO деление на 0
        collision: function(i,j) {
            if (this.balls[i].type != "ball") {
            this.balls[i].Vx = -this.balls[i].Vx;
            this.balls[i].Vy = -this.balls[i].Vy;
                this.balls[j].Vx = -this.balls[j].Vx;
                this.balls[j].Vy = -this.balls[j].Vy;
            }
            else { //столкновение с мячиком
                if (this.balls[j].Vx == 0 && this.balls[j].Vy == 0) { //игрок изначально стоял
                    this.balls[i].Vx = -this.balls[i].Vx;
                    this.balls[i].Vy = -this.balls[i].Vy;
                }
                else { //игрок бежали и тогда мячик принимает скорость игрока, а игрок останавливается
                    var delta =  - this.balls[i].Vx + this.balls[j].Vx;
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;
                        this.balls[i].Vx = delta
                    if (delta != 0)
                        this.balls[j].Vx = -delta/Math.abs(delta);


                    delta =  - this.balls[i].Vy + this.balls[j].Vy;
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;

                    this.balls[i].Vy = delta
                    //this.balls[i].Vy = - this.balls[i].Vy + this.balls[j].Vy;
                    if (delta != 0)
                    this.balls[j].Vy = -delta/Math.abs(delta);
                }
                this.balls[i].x += this.balls[i].Vx;
                this.balls[i].y += this.balls[i].Vy;
            }
        },
        /*
        drawArc: function (myArc, context) {
            var grd;
            context.save();
            context.beginPath();
            if (myArc.type == "human") {
                context.translate(myArc.x, myArc.y);
                var imgW = myArc.radius * 2;
                var imgH = myArc.radius * 2;
                context.rotate(Math.atan2(myArc.Vy, myArc.Vx) - Math.PI / 2);
                grd = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);
            } else {
                context.arc(myArc.x, myArc.y, myArc.radius, 0, 2 * Math.PI, false);
                grd = context.createPattern(this.imageObjBall, 'repeat');
            }
            context.fillStyle = grd;
            context.fill();
            context.restore();
        },
        */
        drawArc: function (myArc, context) {
            var grd;
            context.save();
            context.beginPath();
            if (myArc.type == "human") {
                context.translate(myArc.x * this.coordinateStepX, myArc.y * this.coordinateStepY);
                var imgW = myArc.radius * this.coordinateStepX * 2;
                var imgH = myArc.radius * this.coordinateStepX * 2;
                context.rotate(Math.atan2(myArc.Vy, myArc.Vx) - Math.PI / 2);
                grd = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);
            } else {
                context.arc(myArc.x * this.coordinateStepX, myArc.y * this.coordinateStepY, myArc.radius * this.coordinateStepX, 0, 2 * Math.PI, false);
                grd = context.createPattern(this.imageObjBall, 'repeat');
            }
            context.fillStyle = grd;
            context.fill();
            context.restore();
        },
        processKey: function (e) {
            var maxSpeed = 5;
            if (e.keyCode == 37 && this.myArc.Vx > -maxSpeed) {
                this.myArc.Vx -= 1;
                if (!this.myArc.isNotStop()) this.myArc.Vx -= 1;
            }
            if (e.keyCode == 39 && this.myArc.Vx < maxSpeed) {
                this.myArc.Vx += 1;
                if (!this.myArc.isNotStop()) this.myArc.Vx += 1;
            }
            if (e.keyCode == 38 && this.myArc.Vy > -maxSpeed) {
                this.myArc.Vy -= 1;
                if (!this.myArc.isNotStop()) this.myArc.Vy -= 1;
            }
            if (e.keyCode == 40 && this.myArc.Vy < maxSpeed) {
                this.myArc.Vy += 1;
                if (!this.myArc.isNotStop()) this.myArc.Vy += 1;
            }

            if (e.keyCode == 65 && this.myArc2.Vx > -maxSpeed) {
                this.myArc2.Vx -= 1;
                if (!this.myArc2.isNotStop()) this.myArc2.Vx -= 1;
            }
            if (e.keyCode == 68 && this.myArc2.Vx < maxSpeed) {
                this.myArc2.Vx += 1;
                if (!this.myArc2.isNotStop()) this.myArc2.Vx += 1;
            }
            if (e.keyCode == 87 && this.myArc2.Vy > -maxSpeed) {
                this.myArc2.Vy -= 1;
                if (!this.myArc2.isNotStop()) this.myArc2.Vy -= 1;
            }
            if (e.keyCode == 83 && this.myArc2.Vy < maxSpeed) {
                this.myArc2.Vy += 1;
                if (!this.myArc2.isNotStop()) this.myArc2.Vy += 1;
            }

        }
    });

    return new View();
});