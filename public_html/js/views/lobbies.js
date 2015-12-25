define([
    'backbone',
    'tmpl/lobbies'
], function (
    Backbone,
    tmpl
) {

    var View = Backbone.View.extend({

        template: tmpl,

        initialize: function (userModel, playerModel, lobbyCollection, currentLobby) {

            this.user = userModel;
            this.player = playerModel;
            this.lobbies = lobbyCollection;
            this.lobby = currentLobby;

            this.listenTo(this.lobbies, "change add", this.render);
            this.listenTo(this.lobby, this.lobby.ALREADY_EXIST, this.errorAlreadyExist);
            this.listenTo(this.player, this.player.PLAYER_EXIT, this.render);

            this.render();
        },

        render: function () {
            var self = this;

            this.$el.html(this.template(this.lobbies.fetchAll()));

            this.$el.find('.lobby-table__join').on('click', function(event){
                event.preventDefault();
                var lobbyName = $(this).parent().siblings('.lobby-table__name').text();
                var maxPlayers = $(this).parent().siblings('.js-count').find('js-max').text();
                self.joinLobby(lobbyName, maxPlayers);
            });

            this.$el.find('.lobby-box__create').on('click', function (event) {
                event.preventDefault();
                Backbone.history.navigate('#create', true);
            });

            this.$el.find('.js-back-main').on('click', function(event){
                event.preventDefault();
                Backbone.history.navigate('#', true);
            });

        },

        joinLobby: function(lobbyName, maxPlayers){
            this.player.set({ inLobby: true });
            this.lobby.set({ name: lobbyName, maxPlayers: maxPlayers });
            console.log(this.lobby);
            this.player.trigger(this.player.JOINED_LOBBY);
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
