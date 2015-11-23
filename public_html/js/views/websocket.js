define([
    'backbone',
    'collections/lobbies',
    'models/user',
    'collections/players',
    'models/player'

], function(
    Backbone,
    lobbyCollection,
    userModel,
    players,
    player
){

    var View = Backbone.View.extend({

        lobbies: lobbyCollection,
        user: userModel,
        players: players,
        player: new player(),

        initialize: function() {
            $('#page').append(this.el);
            this.listenTo(this.user, this.user.loginCompleteEvent+" "+this.user.signupCompleteEvent, this.render);
        },

        render: function() {
            this.ws = new WebSocket("ws://localhost:8083/game/");

            this.listenTo(this.user, this.user.joinedLobby, function () {
                var lobbyName = this.user.get('inLobby');
                this.ws.send(JSON.stringify({code: 2, lobby: lobbyName}));
                alert("i joined " + lobbyName);
            });

            this.listenTo(this.user, this.user.createdLobby, function () {
                var lobbyName = this.user.get('createdLobby');
                this.ws.send(JSON.stringify({code: 1, name: lobbyName}));
            });

            this.listenTo(this.player, this.player.click, function () {
                var code = this.player.get('clickCode');
                alert(code);
                //console.log("codeeeee"+code);
                this.ws.send(JSON.stringify({code: code}));
            });

            var self = this;

            this.ws.onopen = function(event){
                //TODO?
            };

            this.ws.onmessage = function (event) {
                var msg = JSON.parse(event.data);
                var code = msg.code;
                switch (code) {
                    case 0:
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
                        break;
                    case 3:
                        alert(JSON.stringify(msg));
                        break;
                    case 4: //joinLobby
                        console.log(self.user);
                        alert(JSON.stringify(msg));
                        break;
                    case 8:
                        if (!self.isStarted) {
                            self.isStarted = true;
                            var ballses = msg.balls;
                            var playersCount = ballses.length;
                            for (var i = 1; i < playersCount; i++) {
                                self.players.add([{
                                    id: i,
                                    x: ballses[i].x.valueOf(),
                                    y: ballses[i].y.valueOf(),
                                    isMyPlayer: i - 1,
                                    team: i - 1
                                }]);
                            }
                        }
                        else {
                            console.log("another start");
                        }
                        break;
                    case 10:
                        var ballses = msg.balls;
                        if (!self.isStarted) {
                            self.isStarted = true;
                            var playersCount = ballses.length;
                            for (var i = 1; i < playersCount; i++) {
                                self.players.add([{
                                    id: i,
                                    x: ballses[i].x.valueOf(),
                                    y: ballses[i].y.valueOf(),
                                    isMyPlayer: i - 1,
                                    team: i - 1
                                }
                                ]);
                            }
                        }
                        for (var i = 0; i < playersCount; i++) {
                            self.players.at(i).set({
                                x: ballses[i].x,
                                y: ballses[i].y,
                                Vx: ballses[i].vx,
                                Vy: ballses[i].vy
                            });
                        }
                        break;

                    default:
                        console.log(msg);
                        break;
                }
            };

            this.ws.onopen = function () {
                var msg = {
                    code: 2,
                    lobby: "test"
                };
                this.send(JSON.stringify(msg));
                msg = {
                    code: 3
                };
                this.send(JSON.stringify(msg));
                console.log("open");
            };

            this.ws.onclose = function (event) {
                console.log("closed");
            }
        }

    });

    return new View();

});