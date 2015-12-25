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
             this.set({'currentPlayers': this.countPlayers()});
             this.trigger(this.UPDATE);
         },

         removePlayer: function(user) {
             this.attributes.team[0] = _.without(this.attributes.team[0], user);
             this.attributes.team[1] = _.without(this.attributes.team[1], user);
             this.set({'currentPlayers': this.countPlayers()});
             this.trigger(this.UPDATE);
         },

         isFull: function() {
             return this.countPlayers() == this.get('maxPlayers')
         },

         countPlayers: function() {
             return this.attributes.team[0].length + this.attributes.team[1].length;
         }



    });

    return Model;

});