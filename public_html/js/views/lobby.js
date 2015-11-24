define([
    'backbone',
    'tmpl/lobby',
    'models/user',
    'models/currentLobby'
], function(
    Backbone,
    tmpl,
    userModel,
    currentLobby
){
    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,
        lobby: currentLobby,

        initialize: function () {
            $('#page').append(this.el);
            this.listenTo(this.lobby, this.lobby.changed, this.render);
        },

        render: function () {
            console.log('CAUGHT');
            this.$el.html(this.template(this.lobby.toJSON()));
        },

        show: function () {

            if(!this.user.get('logged_in')){
                Backbone.history.navigate('#', {trigger: true});
                return;
            }

            this.$el.show();
            this.trigger('show', this);
        },

        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});