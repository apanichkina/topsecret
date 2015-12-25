define([
    'backbone',
    'tmpl/lobby'
], function(
    Backbone,
    tmpl
){
    var View = Backbone.View.extend({

        template: tmpl,

        events: {
            "click .button-back": 'exitLobby'
        },

        initialize: function (userModel, currentLobby) {

            this.user = userModel;
            this.lobby = currentLobby;

            this.listenTo(this.lobby, this.lobby.UPDATE, this.render);
        },

        render: function () {
            this.$el.html(this.template(this.lobby.toJSON()));
        },

        show: function () {

            if(!this.user.get('logged_in')){
                Backbone.history.navigate('#', true);
                return;
            }

            this.$el.fadeIn(750);
            this.trigger('show', this);
        },

        hide: function () {
            this.$el.hide();
        },

        exitLobby: function() {
            this.lobby.trigger(this.lobby.PLAYER_EXIT);
            Backbone.history.navigate('#lobbies', true);
        }

    });

    return View;
});