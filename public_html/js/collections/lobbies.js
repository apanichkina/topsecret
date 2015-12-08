define([
    'backbone',
    'models/lobby'
], function(
    Backbone,
    lobbyModel
){

    var Collection = Backbone.Collection.extend({
        model: lobbyModel,

        fetchAll: function(){
            return this.toJSON();
        }

    });

    return Collection;

});