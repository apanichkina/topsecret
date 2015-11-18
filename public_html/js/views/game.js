/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/game',
    'models/user',
    'models/player',
    'collections/players'
], function (Backbone,
             tmpl,
             userModel,
             player,
             players) {

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,
        player: player,
        players: players,


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
            this.fieldW = 1397;
            this.fieldH = 953;

            this.resizeCanvas();

            this.imageObj = new Image();
            this.imageObj.src = "../../img/football_field.jpg";

            this.imageObjBall = new Image();
            this.imageObjBall.src = "../../img/ball.jpg";

            this.imageObjHead = new Image();
            this.imageObjHead.src = "../../img/head.png";

            this.balls = [];
            this.players = new players();


            this.borderWidth = 3;
            //TODO сделать как наследника
            this.ball = {
                x: this.fieldW / 2,
                y: this.fieldH / 2,
                radius: 10,
                Vx: 0,
                Vy: 0,
                type: "ball"
            };
            this.maxBallSpeed = 3;
            this.balls.push(this.ball);
            this.teamColors = ["ball","yellow","yellow","blue","blue"];
            this.whoIs = [0,1,0,0,0];

            window.onkeydown = this.processKey.bind(this);
            window.addEventListener('resize', this.resizeCanvas.bind(this), false);

            this.animate();
        },
        show: function () {
            console.log(this.user.logged_in);
            this.$el.show();
            this.trigger("show", this);


            /////Oleg
            this.ws = new WebSocket("ws://localhost:8083/game/");

            var that = this;
            this.ws.onmessage = function (event) {
                var msg = JSON.parse(event.data);
                var ID = msg.code;
                console.log(msg);
                switch (ID) {
                    case 0:
                        break;
                    case 3:
                        break;
                    case 8:
                        if (!that.isStarted) {
                            that.isStarted = true;
                            var ballses = msg.balls;
                            that.addPlayers(ballses);
                        }
                        else {
                            console.log("another start");
                        }
                        break;
                    case 10:
                        var ballses = msg.balls;
                        if (!that.isStarted) {
                            that.isStarted = true;
                            that.addPlayers(ballses);
                        }
                        var playersCount = ballses.length;
                        for (var i = 0; i < playersCount; i++) {
                            that.balls[i].x = ballses[i].x;
                            that.balls[i].y = ballses[i].y;
                            that.balls[i].Vx = ballses[i].vx;
                            that.balls[i].Vy = ballses[i].vy;
                        }
                        break;
                    default:
                        console.log(msg);
                }

            };
            this.ws.onopen = function () {
                var msg = {
                    code: 2,
                    lobby: "test"
                };
                this.send(JSON.stringify(msg));
                msg = {
                    code: 3
                };
                this.send(JSON.stringify(msg));
                console.log("open");
            };
            this.ws.onclose = function (event) {
                console.log("closed");
            }
        },
        hide: function () {
            this.$el.hide();
        },


        resizeCanvas: function () {
            var width = window.innerWidth - 26;
            if (width < 800) width = 800;
            this.coordinateStepX = width / this.fieldW;
            var height = window.innerHeight - 40;
            if (height < 550) height = 550;
            //if (height < width * this.koef) height = width * this.koef;
            this.coordinateStepY = height / this.fieldH;
            this.canvas.width = width;
            this.canvas.height = height;
            this.container = {x: 0, y: 0, width: width, height: height};

        },
        //helpers
        addPlayers: function (ballses) {
            var playersCount = ballses.length;
            for (var i = 1; i < playersCount; i++) {
                //var newplayer=new player(i,ballses[i].x.valueOf(),ballses[i].y.valueOf());
                //this.players.add([{id:i,x:ballses[i].x.valueOf(),y:ballses[i].y.valueOf()}]);
                var myArc = {
                    x: ballses[i].x.valueOf(),
                    y: ballses[i].y.valueOf(),
                    radius: 20,
                    Vx: ballses[i].vx.valueOf(),
                    Vy: ballses[i].vy.valueOf(),
                    type: "human",
                    isNotStop: function () {
                        return this.Vx + this.Vy;
                    },
                    borderColor: this.teamColors[i],
                    isMyPlayer: this.whoIs[i]

                };
                this.balls.push(myArc);
            }
        },

        isCollision: function (i, j) { //проверить удар по касательной
            var a = parseFloat(this.balls[j].x) - parseFloat(this.balls[i].x);
            var b = parseFloat(this.balls[j].y) - parseFloat(this.balls[i].y);
            var distance = Math.sqrt(a * a + b * b);
            var minDistance = parseFloat(this.balls[j].radius) + parseFloat(this.balls[i].radius);
            return distance <= minDistance + 1;
        },
        onload: function () {
            var container = this.container;
            var imageObj = this.imageObj;
            this.context.drawImage(imageObj, container.x, container.y, container.width, container.height);
        },
        animate: function () {
            this.resizeCanvas();
            this.context.fillStyle = this.onload();
            for (var i = 0; i < this.balls.length; i++) {
                var myArc = this.balls[i];
                this.drawArc(myArc, this.context);

                //Временно не используется
                var goal_right = false;
                var goal_left = false;
                if (myArc.type == "ball") {
                    if (myArc.y - myArc.radius > this.fieldH * 0.44 && myArc.y + myArc.radius < this.fieldH * 0.565) {
                        if (myArc.x - myArc.radius <= 20) goal_left = true;
                        else if (myArc.x + myArc.radius >= this.fieldW - 20) goal_right = true;
                    }
                }

                if (((myArc.x + myArc.Vx + myArc.radius) * this.coordinateStepX > this.container.x + this.container.width) || ((myArc.x - myArc.radius + myArc.Vx) * this.coordinateStepX < this.container.x)) {
                    myArc.Vx = -myArc.Vx;
                }
                if (((myArc.y + myArc.Vy + myArc.radius) * this.coordinateStepY > this.container.y + this.container.height) || ((myArc.y - myArc.radius + myArc.Vy) * this.coordinateStepY < this.container.y)) {
                    myArc.Vy = -myArc.Vy;
                }

                myArc.x += myArc.Vx;
                myArc.y += myArc.Vy;
            }
            //Временно не используется
            for (var j = 1; j < this.balls.length; ++j) {
                for (var i = j - 1; i >= 0; --i) {

                    if (this.isCollision(i, j)) {
                        //if (this.balls[i].type == "ball") this.collision(i,j);
                        //else if (this.balls[j].type == "ball") this.collision(j,i);
                        this.collision(i, j);
                    }
                }
            }

            requestAnimFrame(this.animate.bind(this));


        },
        //TODO попробовать с трением
        collision: function (i, j) {
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
                    var delta = -this.balls[i].Vx + this.balls[j].Vx;
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;
                    this.balls[i].Vx = delta;
                    if (delta != 0)
                        this.balls[j].Vx = -delta / Math.abs(delta);


                    delta = -this.balls[i].Vy + this.balls[j].Vy;
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;

                    this.balls[i].Vy = delta;
                    //this.balls[i].Vy = - this.balls[i].Vy + this.balls[j].Vy;
                    if (delta != 0)
                        this.balls[j].Vy = -delta / Math.abs(delta);
                }
                this.balls[i].x += this.balls[i].Vx;
                this.balls[i].y += this.balls[i].Vy;
            }
        },

        drawArc: function (myArc, context) {
            var img;
            context.save();
            context.beginPath();
            if (myArc.type == "human") {

                context.translate(myArc.x * this.coordinateStepX, myArc.y * this.coordinateStepY);
                var imgW = myArc.radius * this.coordinateStepY * 2;
                var imgH = myArc.radius * this.coordinateStepY * 2;
                context.rotate(Math.atan2(myArc.Vy, myArc.Vx) - Math.PI / 2);

                context.arc(0, 0, imgH / 2, 0, 2 * Math.PI, false);
                context.strokeStyle = myArc.borderColor;
                context.lineWidth = this.borderWidth;
                context.stroke();
                context.fill();

                context.beginPath();
                img = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);

                context.fillStyle = img;
                context.fill();

                if (myArc.isMyPlayer) {
                    context.beginPath();
                    context.font = 'bold 10pt Calibri';
                    context.fillText('YOU', -13, 0);
                }

            } else {
                context.arc(myArc.x * this.coordinateStepX, myArc.y * this.coordinateStepY, myArc.radius * this.coordinateStepY, 0, 2 * Math.PI, false);
                img = context.createPattern(this.imageObjBall, 'repeat');
                context.fillStyle = img;
                context.fill();
            }
            context.restore();

        },

        processKey: function (e) {
            var msg;
            if (e.keyCode == 37) {
                msg = {
                    code: 5
                };
                this.ws.send(JSON.stringify(msg));
            }
            if (e.keyCode == 39) {
                msg = {
                    code: 4
                };
                this.ws.send(JSON.stringify(msg));
            }
            if (e.keyCode == 38) {
                msg = {
                    code: 7
                };
                this.ws.send(JSON.stringify(msg));
            }
            if (e.keyCode == 40) {
                msg = {
                    code: 6
                };
                this.ws.send(JSON.stringify(msg));
            }
        }
    });

    return new View();
});