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

            window.requestAnimFrame = (function (callback) {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();

            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');

            //window.addEventListener('resize', this.resizeCanvas(), false);
            //resizeCanvas();
            this.myArc = {
                x: 50,
                y: this.canvas.height / 2,
                radius: 35,
                startAngle: Math.PI,
                endAngle: 4 * Math.PI,
                counterClockwise: false,
                borderWidth: 3
            };
            this.runAnimation = true;
            window.onkeydown = this.processKey.bind(this);

            this.drawArc(this.myArc, this.context);
        },
        show: function () {
            console.log(this.user.logged_in);
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        },

        // runAnimation : true,


        //helpers


        animate: function (lastTime, myArc, koefX, koefY) {
            console.log("animate");
            if (this.runAnimation) {
                // update
                var time = (new Date()).getTime();
                var timeDiff = time - lastTime;

                // pixels / second
                var linearSpeed = 100;
                var linearDistEachFrame = linearSpeed * timeDiff / 1000;
                var myArc = this.myArc;
                var currentX = myArc.x;
                var currentY = myArc.y;

                if (currentX <= this.canvas.width - myArc.radius - myArc.borderWidth / 2 && currentX >= myArc.radius + myArc.borderWidth) {
                    var newX = currentX + koefX * linearDistEachFrame;
                    myArc.x = newX;
                }

                if (currentY <= this.canvas.height - myArc.radius - myArc.borderWidth / 2 && currentY >= myArc.radius + myArc.borderWidth) {
                    var newY = currentY + koefY * linearDistEachFrame;
                    myArc.y = newY;
                }
                // clear
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // draw
                this.drawArc(myArc, this.context);

                requestAnimFrame(this.animate.bind(this));

            }

        },
        drawArc: function (myArc, context) {
            context.beginPath();
            context.arc(myArc.x, myArc.y, myArc.radius, myArc.startAngle, myArc.endAngle, myArc.counterClockwise);
            context.fillStyle = '#8ED6FF';
            context.fill();
            context.lineWidth = myArc.borderWidth;
            context.strokeStyle = 'black';
            context.stroke();
        },
        resizeCanvas: function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        },
        processKey: function (e) {
            console.log("click");
            // e = e || window.event;
            if (e.keyCode == 37) {
                // flip flag
                //runAnimation.value = !runAnimation.value;
                console.log("37");
                //if(this.runAnimation) {
                console.log("37");
                var date = new Date();
                var time = date.getTime();
                this.animate(time, this.myArc, -1, 0);
                //this.animate(time, this.myArc, this.runAnimation, this.canvas, this.context, -1, 0);
                //}
            }
            if (e.keyCode == 39) {
                // flip flag
                //runAnimation.value = !runAnimation.value;

                if (this.runAnimation) {
                    console.log("39");
                    var date = new Date();
                    var time = date.getTime();
                    this.animate(time, this.myArc, 1, 0);
                    //this.animate(time, myArc, runAnimation, canvas, context, 1, 0);
                }
            }
            if (e.keyCode == 38) {
                // flip flag
                //runAnimation.value = !runAnimation.value;

                if (this.runAnimation) {
                    var date = new Date();
                    var time = date.getTime();
                    //animate(time, myArc, runAnimation, canvas, context, 0, -1);
                    this.animate(time, this.myArc, 0, -1);
                }
            }
            if (e.keyCode == 40) {
                // flip flag
                //runAnimation.value = !runAnimation.value;

                if (this.runAnimation) {
                    var date = new Date();
                    var time = date.getTime();
                    //animate(time, myArc, runAnimation, canvas, context, 0, 1);
                    this.animate(time, this.myArc, 0, 1);
                }
            }
        }


    });

    return new View();
});