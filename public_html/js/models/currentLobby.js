define([
    'backbone'
], function(
    Backbone
) {

     var Model = Backbone.Model.extend({

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
             this.trigger('change');
         }
    });

    return Model;

});