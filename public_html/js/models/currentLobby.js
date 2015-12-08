define([
    'backbone'
], function(
    Backbone
) {

     var Model = Backbone.Model.extend({

         ALREADY_EXIST: 'alreadyExist',
         PLAYER_EXIT: 'playerExit',
         UPDATE: 'lobbyUpdate',

         initialize: function() {
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
         }
    });

    return Model;

});