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
        player: new player(),
        players: players,


        initialize: function () {
            $('#page').append(this.el);
            //this.listenTo(this.players.changed, this.render);
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

            this.imageObjHead2 = new Image();
            this.imageObjHead2.src = "../../img/head2.png";

            //this.balls = [];

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

            this.players.add([{id:0,x:this.fieldW/2,y:this.fieldH/2,radius:10,type:"ball"}]);
            //this.balls.push(this.ball);
            this.team = [0,1];
            this.teamColors = ["ball","yellow","yellow","blue","blue"];
            this.whoIs = [0,1,0,0,0];

            window.onkeydown = this.processKey.bind(this);
            window.addEventListener('resize', this.resizeCanvas.bind(this), false);

            this.animate();
        },
        show: function () {

            this.$el.show();
            this.trigger("show", this);

            /////Oleg
            //this.ws = new WebSocket("ws://localhost:8083/game/");
            //
            //var that = this;
            //this.ws.onmessage = function (event) {
            //    var msg = JSON.parse(event.data);
            //    var ID = msg.code;
            //    console.log(msg);
            //    switch (ID) {
            //        case 8:
            //            if (!that.isStarted) {
            //                that.isStarted = true;
            //                var ballses = msg.balls;
            //                that.addPlayers(ballses);
            //            }
            //            else {
            //                console.log("another start");
            //            }
            //            break;
            //        case 10:
            //            var ballses = msg.balls;
            //            if (!that.isStarted) {
            //                that.isStarted = true;
            //                that.addPlayers(ballses);
            //            }
            //            var playersCount = ballses.length;
            //            for (var i = 0; i < playersCount; i++) {
            //
            //                //that.balls[i].x = ballses[i].x;
            //                //that.balls[i].y = ballses[i].y;
            //                //that.balls[i].Vx = ballses[i].vx;
            //                //that.balls[i].Vy = ballses[i].vy;
            //
            //                that.players.at(i).set({x: ballses[i].x, y: ballses[i].y, Vx: ballses[i].vx,Vy: ballses[i].vy });
            //            }
            //            break;
            //        default:
            //            console.log(msg);
            //    }
            //
            //};


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
            this.coordinateStepY = height / this.fieldH;
            this.canvas.width = width;
            this.canvas.height = height;
            this.container = {x: 0, y: 0, width: width, height: height};

        },
        //helpers
        addPlayers: function (ballses) {
            var playersCount = ballses.length;
            for (var i = 1; i < playersCount; i++) {
                this.players.add([{id:i,x:ballses[i].x.valueOf(),y:ballses[i].y.valueOf(),borderColor:this.teamColors[i],isMyPlayer: this.whoIs[i],team:i-1}]);
                //var myArc = {
                //    x: ballses[i].x.valueOf(),
                //    y: ballses[i].y.valueOf(),
                //    radius: 20,
                //    Vx: ballses[i].vx.valueOf(),
                //    Vy: ballses[i].vy.valueOf(),
                //    type: "human",
                //    isNotStop: function () {
                //        return this.Vx + this.Vy;
                //    },
                //    borderColor: this.teamColors[i],
                //    isMyPlayer: this.whoIs[i]
                //
                //};
                //this.balls.push(myArc);
            }
            alert(JSON.stringify(this.players));
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
            var gameSpritesCount = this.players.length;
            for (var i = 0; i < gameSpritesCount; i++) {
                //var myArc = this.balls[i];

                var sprite = this.players.at(i);
                var myArc = {
                   radius: sprite.get("radius"),
                    type: sprite.get("type"),
                    Vx: sprite.get("Vx"),
                    Vy: sprite.get("Vy"),
                    y: sprite.get("y"),
                    x: sprite.get("x"),
                    borderColor: sprite.get("borderColor"),
                    isMyPlayer: sprite.get("isMyPlayer"),
                    team: sprite.get("team")
                };
                this.drawArc(myArc, this.context);
                sprite.set({x: myArc.x + myArc.Vx, y: myArc.y + myArc.Vy});

                //Временно не используется
                /*
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
                */
                //myArc.x += myArc.Vx;
                //myArc.y += myArc.Vy;
            }
            //Временно не используется
            /*
            for (var j = 1; j < this.balls.length; ++j) {
                for (var i = j - 1; i >= 0; --i) {

                    if (this.isCollision(i, j)) {
                        //if (this.balls[i].type == "ball") this.collision(i,j);
                        //else if (this.balls[j].type == "ball") this.collision(j,i);
                        this.collision(i, j);
                    }
                }
            }
               */
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
        drawSprite:function(sprite, context){

            var radius = sprite.get("radius");
            var type = sprite.get("type");
            var Vx = sprite.get("Vx");
            var Vy = sprite.get("Vy");
            var y = sprite.get("y");
            var x = sprite.get("x");
            var borderColor = sprite.get("borderColor");

            var img;
            context.save();
            context.beginPath();
            if (type == "human") {

                context.translate(x * this.coordinateStepX, y * this.coordinateStepY);
                var imgW = radius * this.coordinateStepY * 2;
                var imgH = radius * this.coordinateStepY * 2;
                context.rotate(Math.atan2(Vy, Vx) - Math.PI / 2);

                context.arc(0, 0, imgH / 2, 0, 2 * Math.PI, false);
                context.strokeStyle = borderColor;
                context.lineWidth = this.borderWidth;
                context.stroke();
                context.fill();

                context.beginPath();
                img = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);

                context.fillStyle = img;
                context.fill();

                if (sprite.isMyPlayer) {
                    context.beginPath();
                    context.font = 'bold 10pt Calibri';
                    context.fillText('YOU', -13, 0);
                }

            } else {
                context.arc(x * this.coordinateStepX, y * this.coordinateStepY, radius * this.coordinateStepY, 0, 2 * Math.PI, false);
                img = context.createPattern(this.imageObjBall, 'repeat');
                context.fillStyle = img;
                context.fill();
            }
            context.restore();

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

                if (myArc.isMyPlayer) {
                    context.arc(0, 0, imgH / 2, 0, 2 * Math.PI, false);
                    context.strokeStyle = "white";
                    context.lineWidth = this.borderWidth;
                    context.stroke();
                    context.fill();
                }
                context.beginPath();
                if (myArc.team == 0 || myArc.team == 2 ) {
                    img = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);
                } else img = context.drawImage(this.imageObjHead2, -imgW / 2, -imgH / 2, imgW, imgH);

                context.fillStyle = img;
                context.fill();

                /*
                if (myArc.isMyPlayer) {
                    context.beginPath();
                    context.font = 'bold 10pt Calibri';
                    context.fillText('YOU', -13, 0);
                }
                */


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
                this.player.set({clickCode: 5});
                console.log(this.player);
                this.player.trigger(this.player.click);
                msg = {
                    code: 5
                };
                this.ws.send(JSON.stringify(msg));

            }
            if (e.keyCode == 39) {
                this.player.set({clickCode: 4});
                this.player.trigger(this.player.click);
                msg = {
                    code: 4
                };
               // this.ws.send(JSON.stringify(msg));
            }
            if (e.keyCode == 38) {
                this.player.set({clickCode: 7});
                this.player.trigger(this.player.click);
                msg = {
                    code: 7
                };
                //this.ws.send(JSON.stringify(msg));
            }
            if (e.keyCode == 40) {
                this.player.set({clickCode: 6});
                this.player.trigger(this.player.click);
                //msg = {
                //    code: 6
                //};
                //this.ws.send(JSON.stringify(msg));
            }
        }
    });

    return new View();
});