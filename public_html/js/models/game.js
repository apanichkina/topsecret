/**
 * Created by anna on 23.11.15.
 */
define([
    'backbone',
    'api/gameSync'
], function(
    Backbone,
    gameSync
){

    var GameModel = Backbone.Model.extend({
        url: "/",
        sync: gameSync,

        defaults: {
            teams: 2,
            players: 2,
            fieldHeight: 200,
            fieldWidth: 200,
            gameTime: 10,
            maxSpeed: 3,
            ballRadius: 10,
            playersRadius: 20,
            team0: 0,
            team1: 0,
            myNumber: 0
        },
        setProperties: function(data){
            this.set(data);
            this.trigger("changed", this);
        },
        error: function() {
            this.trigger("changed", this);
        }

    });

    return GameModel;
});