define([
    'backbone',
    'tmpl/create'
], function (
    Backbone,
    tmpl
) {

    var View = Backbone.View.extend({

        template: tmpl,

        events: {
            "submit": 'createLobby'
        },

        initialize: function (userModel, playerModel, lobbyCollection, currentLobby) {

            this.user = userModel;
            this.player = playerModel;
            this.lobbies = lobbyCollection;
            this.lobby = currentLobby;

            this.listenTo(this.lobby, this.lobby.ALREADY_EXIST, this.errorAlreadyExist);
            this.render();
        },

        render: function () {
            var self = this;

            this.$el.html(this.template);

            this.$el.find('.button-back').on('click', function(event){
                event.preventDefault();
                Backbone.history.navigate('#lobbies', true);
            });

        },

        createLobby: function (event) {
            event.preventDefault();
            var lobbyName = this.$('.new-lobby-box__input').val();
            this.lobby.set({ name: lobbyName });
            this.player.trigger(this.player.CREATED_LOBBY);
        },

        errorAlreadyExist: function() {
            this.$el.find('.js-create-error').show();
        },

        show: function(){
            if(!this.user.get('logged_in')){
                Backbone.history.navigate('#', true);
                return;
            }

            if(this.player.get('inLobby')){
                Backbone.history.navigate('#lobby', true);
                return;
            }

            this.$el.show();
            this.trigger("show", this);

        },

        hide: function(){
            this.$el.hide();
        }

    });

    return View;

});
