define([
    'backbone',
    'tmpl/game'
], function (Backbone,
             tmpl) {

    var View = Backbone.View.extend({

        template: tmpl,
        is_hidden: true,

        initialize: function (userModel, playerModel, playersCollection, gameModel) {

            /**
             * Setting Models
             * */
            this.user = userModel;
            this.player = playerModel;
            this.players = playersCollection;
            this.game = gameModel;

            this.game.fetch();

            this._prev = [];
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
            window.clearAnimation = (function () {
                return window.cancelRequestAnimationFrame ||
                    window.webkitCancelRequestAnimationFrame ||
                    window.mozCancelRequestAnimationFrame ||
                    window.oCancelRequestAnimationFrame ||
                    window.msCancelRequestAnimationFrame ||
                    function (id) {
                        clearTimeout(id)
                    };
            })();
            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');

            this.endcanvas = document.getElementById('gameEndTablo');
            this.endcontext = this.canvas.getContext('2d');

            this.backgroundcanvas = document.getElementById('gameBackground');
            this.backgroundcontext = this.backgroundcanvas.getContext('2d');

            this.timercanvas = document.getElementById('gameTimer');
            this.timercontext = this.timercanvas.getContext('2d');

            this.scorecanvas = document.getElementById('gameScore');
            this.scorecontext = this.scorecanvas.getContext('2d');


            this.fieldW = this.game.get("fieldWidth");
            this.fieldH = this.game.get("fieldHeight");


            this.gametimeConf = this.game.get("gameTime");

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
            this.borderWidth = 4;


            window.onkeyup = this.processKey.bind(this);
            window.addEventListener('resize', this.resizeCanvas.bind(this), false);

            this.firstVisit = true;
            this.endFontSize = 120;
            this.playerNameFontSize = 15;


        },
        show: function () {
            if (!this.user.get('logged_in') || !this.player.get('inLobby')) {
                Backbone.history.navigate('#', true);
                return;
            }
            this.resizeCanvas();
            this.number = this.game.get("myNumber");
            if (this.game.get('isStarted') == true) {
                this.game.set({isStarted: false});
                var date = new Date();
                var secconds = date.getSeconds();
                this.timeToEnd = (secconds + this.gametimeConf);
            }
            //window.clearAnimation(this.animate.bind(this));
            if (this.firstVisit) {
                this.animate();
                this.firstVisit = false;
            }
            this.$el.show();
            this.is_hidden = false;
            this.trigger("show", this);
        },
        hide: function () {
            this.is_hidden = true;
            this.$el.hide();
        },

        //helpers
        resizeCanvas: function () {
            var width = window.innerWidth;
            if (width < 800) width = 800;
            this.coordinateStepX = width / this.fieldW;
            var height = window.innerHeight - 40;
            if (height < 550) height = 550;

            this.coordinateStepY = height / this.fieldH;

            this.backgroundcanvas.width = width;
            this.backgroundcanvas.height = height;
            this.backgroundcontainer = {x: 0, y: 0, width: width, height: height};

            this.redrawBackground();

            this.canvas.width = width;
            this.canvas.height = height;
            this.container = {x: 0, y: 0, width: width, height: height};

            this.timercanvas.width = 100;
            this.timercanvas.height = 20;

            this.scorecanvas.width = 300;
            this.scorecanvas.height = 20;

            this.endcanvas.width = width;
            this.endcanvas.height = height;
            this.endcontainer = {x: 13, y: 0, width: width, height: height};
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

        redrawBackground: function () {
            var container = this.backgroundcontainer;
            var imageObj = this.imageObj;
            this.backgroundcontext.drawImage(imageObj, container.x, container.y, container.width, container.height);
        },

        onloadTablo: function (container, context) {
            var imageObj = this.imageObjTablo;
            context.drawImage(imageObj, container.x, container.y, container.width, container.height);
        },

        savePrev: function (i, x, y) {
            this._prev[i] = [x,y];
        },

        //TODO closePath;
        animate: function () {

            this.context.clearRect(this.container.x, this.container.y, this.container.width, this.container.height);


            this.timercontext.clearRect(0, 0, this.timercanvas.width, this.timercanvas.height);
            this.scorecontext.clearRect(0, 0, this.scorecanvas.width, this.scorecanvas.height);
            if (this.game.get('isEnded') == false) {
                var date = new Date();
                this.gametime = (this.timeToEnd - date.getSeconds()) % 60;
            }
            else {
                this.gametime = 0;
            }

            for (var i = 0; i < this.players.length; i++) {
                var Vx = this.players.at(i).get("Vx");
                var Vy = this.players.at(i).get("Vy");
                var y = this.players.at(i).get("y");
                var x = this.players.at(i).get("x");

                this.savePrev(i,x,y);

                this.players.at(i).set({x: x + Vx, y: y + Vy});
                this.drawArc(this.game, this.players.at(i), this.context, this.timercontext, this.scorecontext, this.endcontext);
            }
            //Временно не используется
            for (var j = 1; j < this.players.length; ++j) {
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
                this.players.at(i).set({Vx: -this.players.at(i).get("Vx"), Vy: -this.players.at(i).get("Vy")});
                this.players.at(j).set({Vx: -this.players.at(j).get("Vx"), Vy: -this.players.at(j).get("Vy")})
            }
            else { //столкновение с мячиком
                if (this.players.at(j).get("Vx") == 0 && this.players.at(j).get("Vy") == 0) { //игрок изначально стоял
                    this.players.at(i).set({Vx: -this.players.at(i).get("Vx"), Vy: -this.players.at(i).get("Vy")});
                }
                else {
                    var delta = -this.players.at(i).get("Vx") + this.players.at(j).get("Vx");
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;
                    this.players.at(i).set({Vx: delta});
                    if (delta != 0)
                        this.players.at(j).set({Vx: -delta / Math.abs(delta)});

                    delta = -this.players.at(i).get("Vy") + this.players.at(j).get("Vy");
                    if (delta > this.maxBallSpeed) delta = this.maxBallSpeed;
                    else if (delta < -this.maxBallSpeed) delta = -this.maxBallSpeed;
                    this.players.at(i).set({Vy: delta});
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
        drawArc: function (game, myArc, context, timercontext, scorecontext, endcontext) {
            var img;
            var x = myArc.get("x");
            var y = myArc.get("y");
            var radius = myArc.get("radius");
            context.save();
            context.beginPath();
            if (myArc.get("type") == "human") {

                context.translate(x * this.coordinateStepX, y * this.coordinateStepY);
                var imgW = radius * this.coordinateStepY * 2;
                var imgH = radius * this.coordinateStepY * 2;
                var fontSize = this.playerNameFontSize;

                // Тут можно подписать игрока
                context.beginPath();
                context.fillStyle = "white";
                context.font = fontSize+'pt Calibri';
                context.fillText(myArc.get("name"), -fontSize * (myArc.get("name").length + 1) / 4, radius + fontSize);

                context.rotate(Math.atan2(myArc.get("Vy"), myArc.get("Vx")) - Math.PI / 2);

                if (myArc.get("isMyPlayer")) {
                    context.arc(0, 0, imgH / 2, 0, 2 * Math.PI, false);
                    context.strokeStyle = "white";
                    context.lineWidth = this.borderWidth;
                    context.stroke();
                    context.fill();
                }
                context.beginPath();
                if (myArc.get("team") == 0) {
                    img = context.drawImage(this.imageObjHead, -imgW / 2, -imgH / 2, imgW, imgH);
                } else img = context.drawImage(this.imageObjHead2, -imgW / 2, -imgH / 2, imgW, imgH);

                context.fillStyle = img;
                context.fill();

                //// Тут можно подписать своего игрока
                // if (myArc.get("isMyPlayer")) {
                //     context.beginPath();
                //     context.fillStyle = "white";
                //     context.font = 'bold '+this.playerNameFontSize+'pt Calibri';
                //     context.fillText(this.names[0], -this.playerNameFontSize * this.names[0].length / 4, -(radius));
                // } else
                // {
                //     context.beginPath();
                //     context.fillStyle = "white";
                //     context.font = 'bold 15pt Calibri';
                //     context.fillText(this.names[1],-this.names[1].length/2, -(5+radius));
                // }


            } else {
                context.arc(x * this.coordinateStepX, y * this.coordinateStepY, radius * this.coordinateStepY, 0, 2 * Math.PI, false);
                img = context.createPattern(this.imageObjBall, 'repeat');
                context.fillStyle = img;
                context.fill();
            }
            context.restore();
            timercontext.beginPath();
            timercontext.font = '20px led-digital-7';
            timercontext.fillStyle = "white";
            timercontext.fill();
            timercontext.fillText("Time " + this.gametime, 0, 15);
            timercontext.closePath();

            scorecontext.beginPath();
            scorecontext.font = '20px led-digital-7';
            scorecontext.fillStyle = "white";
            scorecontext.fill();
            scorecontext.fillText("Choco " + this.game.get("team1") + " : " + this.game.get("team0") + " Ginger", 0, 15);

            if (game.get('isEnded') == true) {
                endcontext.beginPath();
                endcontext.font = this.endFontSize+'px Calibri';
                endcontext.lineWidth = 3;
                endcontext.strokeStyle = 'black';
                var winnerName = "";
                var winner = this.game.get('winner');
                if (winner === 0) winnerName = "Winner Ginger";
                else if (winner === 1)
                    winnerName = "Winner Choco";
                else {
                    winnerName = "Draw";
                }
                endcontext.strokeText(winnerName, this.endcontainer.width / 2 - this.endFontSize * winnerName.length / 4, this.endcontainer.height / 2);
                endcontext.fill();
            }

        },

        processKey: function (e) {
            var msg;
            if (!this.is_hidden && e.keyCode == 37) {//влево
                if (this.players.at(this.number).get("Vx") > -this.maxBallSpeed) {
                    this.user.set({clickCode: 5});
                    this.user.trigger(this.user.click);
                }
            }
            if (!this.is_hidden && e.keyCode == 39) {//вправо
                if (this.players.at(this.number).get("Vx") < this.maxBallSpeed) {
                    this.user.set({clickCode: 4});
                    this.user.trigger(this.user.click);
                }
            }
            if (!this.is_hidden && e.keyCode == 38) {//вверх
                if (this.players.at(this.number).get("Vy") > -this.maxBallSpeed) {
                    this.user.set({clickCode: 7});
                    this.user.trigger(this.user.click);
                }
            }
            if (!this.is_hidden && e.keyCode == 40) {//вниз
                if (this.players.at(this.number).get("Vy") < this.maxBallSpeed) {
                    this.user.set({clickCode: 6});
                    this.user.trigger(this.user.click);
                }
            }
        }
    });

    return View;
});
