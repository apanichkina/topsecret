define([
    'backbone',
    'tmpl/lobby'
], function(
    Backbone,
    tmpl
){
    var View = Backbone.View.extend({

        template: tmpl,

        initialize: function (userModel, currentLobby) {

            this.user = userModel;
            this.lobby = currentLobby;

            this.listenTo(this.lobby, this.lobby.lobbyChanged, this.render);
        },

        render: function () {
            console.log('CAUGHT');
            this.$el.html(this.template(this.lobby.toJSON()));
        },

        show: function () {

            if(!this.user.get('logged_in')){
                Backbone.history.navigate('#', true);
                return;
            }

            this.$el.show();
            this.trigger('show', this);
        },

        hide: function () {
            this.$el.hide();
        }

    });

    return View;
});