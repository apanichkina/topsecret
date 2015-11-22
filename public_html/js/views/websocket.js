define([
    'backbone',
    'collections/lobbies',
    'models/user'
], function(
    Backbone,
    lobbyCollection,
    userModel
){

    var View = Backbone.View.extend({

        lobbies: lobbyCollection,
        user: userModel,

        initialize: function() {
            $('#page').append(this.el);
            this.listenTo(this.user, this.user.loginCompleteEvent+" "+this.user.signupCompleteEvent, this.render);
        },

        render: function() {
            this.ws = new WebSocket("ws://127.0.0.1:8083/game/");

            this.listenTo(this.user, this.user.joinedLobby, function(){
                var lobbyName = this.user.get('inLobby');
                this.ws.send(JSON.stringify({code:2, lobby:lobbyName}));
                alert("i joined "+lobbyName);
            });

            this.listenTo(this.user, this.user.createdLobby, function(){
                var lobbyName = this.user.get('createdLobby');
                this.ws.send(JSON.stringify({code:1, name:lobbyName}));
            });

            var self = this;

            this.ws.onmessage = function (event) {
                var msg = JSON.parse(event.data);
                var code = msg.code;
                switch (code) {
                    case 0:
                        alert(JSON.stringify(msg));
                        self.lobbies.set(msg.lobbies);
                        self.lobbies.trigger(self.lobbies.changed);
                        break;
                    case 1:
                        alert(JSON.stringify(msg));
                        //TODO OLEG!
                        delete msg.code;
                        self.lobbies.add(msg);
                        self.lobbies.trigger(self.lobbies.changed);
                        break;
                    case 2:
                        self.user.set('inLobby', self.user.get('createdLobby'));
                        console.log(self.user);
                        break;
                    case 3:
                        alert(JSON.stringify(msg));
                        break;
                    case 4:
                        alert(JSON.stringify(msg));
                        break;
                    default:
                        break;
                }
            };
        }

    });

    return new View();

});