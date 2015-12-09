define([
    'backbone'
], function(
    Backbone
) {

     var Model = Backbone.Model.extend({

         MAX_PLAYERS: 2,

         ALREADY_EXIST: 'alreadyExist',
         PLAYER_EXIT: 'playerExit',
         UPDATE: 'lobbyUpdate',

         initialize: function() {
             this.unsetTeams();
         },

         unsetTeams: function(){
             this.set({
                 team:{
                     0:[],
                     1:[]
                 }
             })
         },

         addPlayer: function(user, team){
             this.attributes.team[team].push(user);
             this.trigger(this.UPDATE);
         },

         //TODO RETURN team FROM SERVER
         removePlayer: function(user) {
             this.attributes.team[0] = _.without(this.attributes.team[0], user);
             this.attributes.team[1] = _.without(this.attributes.team[1], user);
             this.trigger(this.UPDATE);
         },

         isFull: function() {
             return this.attributes.team[0].length + this.attributes.team[1].length == this.MAX_PLAYERS;
         }

    });

    return Model;

});