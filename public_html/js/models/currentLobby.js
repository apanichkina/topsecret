define([
    'backbone'
], function(
    Backbone
) {

    var Model = Backbone.Model.extend({

        lobbyChanged: 'lobbyChanged',

        init: function() {
            this.set({
                team: {
                    0: [],
                    1: []
                }
            });
        },

        addPlayer: function(user, team){
            console.log(this.toJSON());
            this.attributes.team[team].push(user);
            alert('GONNA TRIGGER');
            this.trigger(this.lobbyChanged);
        }
    });

    return new Model();

});