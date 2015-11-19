define([
    'backbone',
    'tmpl/lobby',
    'models/user',
    'collections/lobbies'
], function (
    Backbone,
    tmpl,
    userModel,
    lobbyCollection
) {

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,


        initialize: function () {
            $('#page').append(this.el);
            this.listenTo(this, 'changed', this.render);
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.lobbies));
        },

        show: function(){
            this.$el.show();
            this.ws = new WebSocket("ws://127.0.0.1:8083/game/");
            this.trigger("show", this);

            var self = this;

            this.ws.onmessage = function (event) {
                var msg = JSON.parse(event.data);
                var code = msg.code;
                console.log(msg);
                switch (code) {
                    case 0:
                        self.lobbies = new lobbyCollection().set(msg.lobbies);
                        self.trigger("changed");
                        break;
                    default:
                        break;
                }
            };

        },

        hide: function(){
            this.$el.hide();
        }

    });

    return new View();

});
