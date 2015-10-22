/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/game',
    'models/user'
], function(
    Backbone,
    tmpl,
    userModel
){

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,

        initialize: function () {
            $('#page').append(this.el);
            window.requestAnimFrame = (function(callback) {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                    function(callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            var canvas = document.getElementById('myCanvas');
            context = canvas.getContext('2d');

            window.addEventListener('resize', this.resizeCanvas(), false);
            resizeCanvas();
            var myArc = {
                x: 50,
                y: canvas.height / 2,
                radius: 35,
                startAngle: Math.PI,
                endAngle: 4 * Math.PI,
                counterClockwise: false,
                borderWidth: 3
            };
            var runAnimation = {
                //value: false
                value: true
            };
            window.onkeydown = processKey;
            drawArc(myArc, context);

            this.render();
        },
        render: function () {
            this.$el.html(this.template);
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
        drawArc: function(myArc, context) {
        context.beginPath();
        context.arc(myArc.x, myArc.y, myArc.radius, myArc.startAngle, myArc.endAngle, myArc.counterClockwise);
        context.fillStyle = '#8ED6FF';
        context.fill();
        context.lineWidth = myArc.borderWidth;
        context.strokeStyle = 'black';
        context.stroke();
        },
        animate: function(lastTime, myArc, runAnimation, canvas, context, koefX, koefY) {
        if(runAnimation.value) {
            // update
            var time = (new Date()).getTime();
            var timeDiff = time - lastTime;

            // pixels / second
            var linearSpeed = 100;
            var linearDistEachFrame = linearSpeed * timeDiff / 1000;
            var currentX = myArc.x;
            var currentY = myArc.y;

            if(currentX <= canvas.width - myArc.radius - myArc.borderWidth / 2 && currentX >= myArc.radius + myArc.borderWidth) {
                var newX = currentX + koefX * linearDistEachFrame;
                myArc.x = newX;
            }

            if(currentY <= canvas.height - myArc.radius - myArc.borderWidth / 2 && currentY >= myArc.radius + myArc.borderWidth) {
                var newY = currentY + koefY * linearDistEachFrame;
                myArc.y = newY;
            }
            // clear
            context.clearRect(0, 0, canvas.width, canvas.height);

            // draw
            drawArc(myArc, context);

            // request new frame
            requestAnimFrame(function() {
                animate(time, myArc, runAnimation, canvas, context, koefX, koefY);
            });
        }
        },
        resizeCanvas: function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        },
        processKey: function(e) {
        if (e.keyCode == 37) {
            // flip flag
            //runAnimation.value = !runAnimation.value;

            if(runAnimation.value) {
                var date = new Date();
                var time = date.getTime();
                animate(time, myArc, runAnimation, canvas, context, -1, 0);
            }
        }
        if (e.keyCode == 39){
            // flip flag
            //runAnimation.value = !runAnimation.value;

            if(runAnimation.value) {
                var date = new Date();
                var time = date.getTime();
                animate(time, myArc, runAnimation, canvas, context, 1, 0);
            }
        }
        if (e.keyCode == 38){
            // flip flag
            //runAnimation.value = !runAnimation.value;

            if(runAnimation.value) {
                var date = new Date();
                var time = date.getTime();
                animate(time, myArc, runAnimation, canvas, context, 0, -1);
            }
        }
        if (e.keyCode == 40){
            // flip flag
            //runAnimation.value = !runAnimation.value;

            if(runAnimation.value) {
                var date = new Date();
                var time = date.getTime();
                animate(time, myArc, runAnimation, canvas, context, 0, 1);
            }
        }
    }


    });

    return new View();
});