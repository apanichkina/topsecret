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
        lobbies: lobbyCollection,

        events: {
            "submit": 'createLobby'
        },


        initialize: function () {
            $('#page').append(this.el);
            this.listenTo(lobbyCollection, this.lobbies.changed, this.render);
        },

        render: function () {
            var self = this;
            this.$el.html(this.template(this.lobbies.fetchAll()));

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

        },

        joinLobby: function(lobbyName){
            this.user.set('inLobby', lobbyName);
            this.user.trigger(this.user.joinedLobby);
        },
        
        createLobby: function (event) {
            event.preventDefault();
            var lobbyName = this.$('.new-lobby-box__input').val();
            alert('creating new lobby = '+lobbyName);
            this.user.set('createdLobby', lobbyName);
            this.user.trigger(this.user.createdLobby)
        },

        show: function(){
            if(!this.user.get('logged_in')){
                Backbone.history.navigate('#', {trigger: true});
                return;
            }

            this.$el.show();
            this.trigger("show", this);

        },

        hide: function(){
            this.$el.hide();
        }

    });

    return new View();

});
