define([
    'backbone',
    'tmpl/game'
], function (
    Backbone,
    tmpl
)
{

    var View = Backbone.View.extend({

        template: tmpl,

        initialize: function (userModel, playerModel, playersCollection, gameModel) {

            /**
             * Setting Models
             * */
            this.user = userModel;
            this.player = playerModel;
            this.players = playersCollection;
            this.game = gameModel;

            this.game.fetch();
            //console.log(this.game.attributes);
            this.listenTo(this.game, "changed", this.render);
            /*
            this.game.on('change', this.wait);
            this.user.on('change', this.wait);
            */
        },
        /*
        _waitModel: {
          game: false,
            user: false
        },
        wait: function (evt, model) {
            if (model === this.game) {
                _waitModel.game = true;
            } else if (model === this.user) {
                _waitModel.game = true;
            }

            if (_waitModel.game && _waitModel.user) {
                this.render();
            }
        },*/
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


            this.timercanvas = document.getElementById('gameTimer');
            this.timercontext = this.timercanvas.getContext('2d');
            // TODO Заглушки
            this.counter = 0;
            this.time = 300;
            this.score1 = 1;
            this.score2 = 2;
            ///////
            this.scorecanvas = document.getElementById('gameScore');
            this.scorecontext = this.scorecanvas.getContext('2d');

            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');

            this.fieldW = this.game.get("fieldWidth");
            this.fieldH = this.game.get("fieldHeight");

            this.gameTime = this.game.get("ballRadius");

            this.imageObj = new Image();
            this.imageObj.src = "../../img/football_field.jpg";

            this.imageObjTablo = new Image();
            this.imageObjTablo.src = "../../img/tablo.png";

            this.imageObjBall = new Image();
            this.imageObjBall.src = "../../img/ball.jpg";

            this.imageObjHead = new Image();
            this.imageObjHead.src = "../../img/head.png";

            this.imageObjHead2 = new Image();
            this.imageObjHead2.src = "../../img/head2.png";

            this.maxBallSpeed = this.game.get("maxSpeed");
            this.borderWidth = 3;
            this.players.add([{id:0,x:this.fieldW/2,y:this.fieldH/2,radius:this.game.get("ballRadius"),type:"ball"}]);
           //TODO Заглушки
            this.team = [0,1];
            this.teamColors = ["ball","yellow","yellow","blue","blue"];
            this.whoIs = [0,1,0,0,0];
            ////
            window.onkeyup = this.processKey.bind(this);
            window.addEventListener('resize', this.resizeCanvas.bind(this), false);
            this.resizeCanvas();
            //this.animate();


        },
        show: function () {
            console.log(this.game.attributes);
            this.animate();
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        },

        //helpers
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
            this.timercanvas.width = 100;
            this.timercanvas.height = 20;
            this.timercontainer = {x: 0, y: 0, width: this.timercanvas.width / 10, height: this.timercanvas.height / 10};
            this.scorecanvas.width = 300;
            this.scorecanvas.height = 20;
            this.scorecontainer = {x: 0, y: 0, width: this.scorecanvas.width / 10, height: this.scorecanvas.height / 10};
        },
        addPlayers: function (ballses) {
            var playersCount = ballses.length;
            for (var i = 1; i < playersCount; i++) {
                this.players.add([{id:i,x:ballses[i].x.valueOf(),y:ballses[i].y.valueOf(),borderColor:this.teamColors[i],isMyPlayer: this.whoIs[i],team:i-1}]);
            }
        },
        isCollisionPlayers: function (i, j) {
            var a = parseFloat(this.players.at(j).get("x")) - parseFloat(this.players.at(i).get("x"));
            var b = parseFloat(this.players.at(j).get("y")) - parseFloat(this.players.at(i).get("y"));
            var distance = Math.sqrt(a * a + b * b);
            var minDistance = parseFloat(this.players.at(j).get("radius")) + parseFloat(this.players.at(i).get("radius"));
            return distance <= minDistance + 1;
        },
        isCollision: function (i, j) {
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

        onloadTablo: function (container, context) {
           // var container = this.timercontainer;
            var imageObj = this.imageObjTablo;
            context.drawImage(imageObj, container.x, container.y, container.width, container.height);
        },


        animate: function () {
            this.resizeCanvas();
            this.context.fillStyle = this.onload();
            this.timercontext.fillStyle = this.onloadTablo(this.timercontainer, this.timercontext);
            this.scorecontext.fillStyle = this.onloadTablo(this.scorecontainer, this.scorecontext);
            this.counter = this.counter + 1;
            if ( this.counter == 60 ) {
                this.time = this.time - 1;
                this.counter = 0;
                this.score1 = this.score1 + 2;
                this.score2 = this.score2 + this.score1;
            }


            var gameSpritesCount = this.players.length;
            for (var i = 0; i < gameSpritesCount; i++) {
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
                this.drawArc(myArc, this.context, this.timercontext, this.scorecontext);

                sprite.set({x: myArc.x + myArc.Vx, y: myArc.y + myArc.Vy});

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
            for (var j = 1; j < gameSpritesCount; ++j) {
                for (var i = j - 1; i >= 0; --i) {

                    if (this.isCollisionPlayers(i, j)) {
                        //if (this.balls[i].type == "ball") this.collision(i,j);
                        //else if (this.balls[j].type == "ball") this.collision(j,i);
                        this.collisionPlayers(i, j);
                    }
                }
            }
            requestAnimFrame(this.animate.bind(this));


        },
        collisionPlayers: function (i, j) {
            if (this.players.at(i).get("type") != "ball") {
                this.players.at(i).set({Vx: - this.players.at(i).get("Vx"),Vy: - this.players.at(i).get("Vy")});
                this.players.at(j).set({Vx: - this.players.at(j).get("Vx"),Vy: - this.players.at(j).get("Vy")})
            }
            else { //столкновение с мячиком
                if (this.players.at(j).get("Vx") == 0 && this.players.at(j).get("Vy") == 0) { //игрок изначально стоял
                    this.players.at(i).set({Vx: - this.players.at(i).get("Vx"),Vy: - this.players.at(i).get("Vy")});
                }
                else {
                    var delta = -this.players.at(i).get("Vx") + this.players.at(j).get("Vx");
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;
                    this.players.at(i).set({Vx: delta});
                    if (delta != 0)
                        this.players.at(j).set({Vx: -delta / Math.abs(delta)});

                    delta =  -this.players.at(i).get("Vy") + this.players.at(j).get("Vy");
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;
                    this.players.at(i).set({Vy :delta});
                    //this.balls[i].Vy = - this.balls[i].Vy + this.balls[j].Vy;
                    if (delta != 0)
                        this.players.at(j).set({Vy: -delta / Math.abs(delta)});
                }
                //this.balls[i].x += this.balls[i].Vx;
                //this.balls[i].y += this.balls[i].Vy;
            }

        },
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
        drawArc: function (myArc, context, timercontext, scorecontext) {
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

                /* Тут можно подписать своего игрока
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
            timercontext.beginPath();
            timercontext.font = '20px led-digital-7';
            timercontext.fillStyle = "white";
            timercontext.fill();
            timercontext.fillText("Time "+ this.time, 0,  15);

            scorecontext.beginPath();
            scorecontext.font = '20px led-digital-7';
            scorecontext.fillStyle = "white";
            scorecontext.fill();
            scorecontext.fillText("Red "+ this.score1 + " : " + this.score2 + " Black", 0,  15);



        },

        processKey: function (e) {
            var msg;
            if (e.keyCode == 37) {
                this.user.set({clickCode: 5});
                this.user.trigger(this.user.click);
            }
            if (e.keyCode == 39) {
                this.user.set({clickCode: 4});
                this.user.trigger(this.user.click);
            }
            if (e.keyCode == 38) {
                this.user.set({clickCode: 7});
                this.user.trigger(this.user.click);
            }
            if (e.keyCode == 40) {
                this.user.set({clickCode: 6});
                this.user.trigger(this.user.click);
            }
        }
    });

    return View;
});