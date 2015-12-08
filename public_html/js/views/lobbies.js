define([
    'backbone',
    'tmpl/lobbies'
], function (
    Backbone,
    tmpl
) {

    var View = Backbone.View.extend({

        template: tmpl,

        //TODO ubrat' eto govno
        showError: false,
        REQUEST_LOBBIES: 'requestLobbies',

        events: {
            "submit": 'createLobby'
        },

        initialize: function (userModel, playerModel, lobbyCollection, currentLobby) {

            this.user = userModel;
            this.player = playerModel;
            this.lobbies = lobbyCollection;
            this.lobby = currentLobby;

            this.listenTo(this.lobbies, "change add", this.render);
            this.listenTo(this.lobby, this.lobby.ALREADY_EXIST, this.errorAlreadyExist);
            this.listenTo(this.player, this.player.PLAYER_EXIT, this.render);
        },

        render: function () {
            var self = this;

            this.$el.html(this.template(this.lobbies.fetchAll()));

            if(self.showError) {
                self.$('.new-lobby-box').show();
                self.$('.lobby-box').hide();
                self.$('.new-lobby-box__error').show();
            }

            this.$('.lobby-table__join').on('click', function(event){
                event.preventDefault();
                var lobbyName = $(this).parent().siblings('.lobby-table__name').text();
                self.joinLobby(lobbyName);
            });

            this.$('.lobby-box__create').on('click', function (event) {
                event.preventDefault();
                self.$('.new-lobby-box').show();
                self.$('.lobby-box').hide();
            });

            this.$('.button-back').on('click', function(event){
                event.preventDefault();
                self.$('.new-lobby-box').hide();
                self.$('.lobby-box').show();
            });

        },

        joinLobby: function(lobbyName){
            this.player.set({ inLobby: true });
            this.lobby.set({ name: lobbyName });
            this.player.trigger(this.player.JOINED_LOBBY);
        },
        
        createLobby: function (event) {
            event.preventDefault();
            var lobbyName = this.$('.new-lobby-box__input').val();
            this.lobby.set({ name: lobbyName });
            this.player.trigger(this.player.CREATED_LOBBY);
        },

        errorAlreadyExist: function() {
            this.showError = true;
            this.lobby.set({ name: '' });
            this.render()
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
