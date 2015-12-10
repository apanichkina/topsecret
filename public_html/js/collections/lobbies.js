define([
    'backbone',
    'models/lobby'
], function(
    Backbone,
    lobbyModel
){

    var Collection = Backbone.Collection.extend({
        model: lobbyModel,

        REQUEST_LOBBIES: 'requestLobbies',

        fetchAll: function(){
            return this.toJSON();
        }

    });

    return Collection;

});