define([
    'backbone',
    'collections/lobbies'
], function(
    Backbone,
    lobbyCollection
){

    var View = Backbone.View.extend({

        lobbies: lobbyCollection,

        initialize: function() {
            $('#page').append(this.el);
            this.render();
        },

        render: function() {
            this.ws = new WebSocket("ws://127.0.0.1:8083/game/");
            var self = this;

            this.ws.onmessage = function (event) {
                var msg = JSON.parse(event.data);
                var code = msg.code;
                switch (code) {
                    case 0:
                        self.lobbies.set(msg.lobbies);
                        self.lobbies.trigger(self.lobbies.changed);
                        break;
                    default:
                        break;
                }
            };
        }

    });

    return new View();

});