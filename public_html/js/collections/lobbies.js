define([
    'backbone',
    'models/lobby'
], function(
    Backbone,
    lobbyModel
){

    return Backbone.Collection.extend({
        model: lobbyModel,

        getAll: function(){
            return this;
        }
    });

});