define([
    'backbone',
    'collections/lobbies',
    'models/user',
    'collections/players',
    'models/player',
    'models/currentLobby',
    'models/game'

], function(
    Backbone,
    lobbyCollection,
    userModel,
    players,
    player,
    currentLobby,
    gameModel
){

    var View = Backbone.View.extend({

        lobbies: lobbyCollection,
        lobby: currentLobby,
        user: userModel,
        players: players,
        player: player,
        game: gameModel,

        initialize: function () {
            $('#page').append(this.el);
            this.listenTo(this.user, this.user.loginCompleteEvent + " " + this.user.signupCompleteEvent, this.render);

            this.listenTo(this.user, this.user.joinedLobby, function () {
                if(!this.ws) return;
                var lobbyName = this.user.get('inLobby');
                this.ws.send(JSON.stringify({code: 2, lobby: lobbyName}));
                alert("i joined " + lobbyName);
            });
            this.listenTo(this.user, this.user.createdLobby, function () {
                if(!this.ws) return;
                var lobbyName = this.user.get('createdLobby');
                this.ws.send(JSON.stringify({code: 1, name: lobbyName}));
            });

            this.listenTo(this.user, this.user.click, function () {
                if(!this.ws) return;
                var code = this.user.get('clickCode');
                this.ws.send(JSON.stringify({code: code}));
            });

            this.lobby.init();
        },

        render: function() {
            this.ws = new WebSocket("ws://localhost:8083/game/");

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
                        console.log(msg);
                        self.user.set('inLobby', msg.name);
                        self.lobby.set('name', msg.name);
                        self.lobby.trigger(self.lobby.lobbyChanged);
                        Backbone.history.navigate('#lobby', {trigger: true});
                        break;
                    case 3:
                        alert(JSON.stringify(msg));
                        break;
                    case 4: //joinLobby
                        console.log(msg);
                        Backbone.history.navigate('#lobby', {trigger: true});
                        break;
                    case 7: //user joins lobby
                        console.log(msg);
                        self.lobby.addPlayer(msg.user, msg.team);
                        break;
                    case 8:
                        if (!self.isStarted) {
                            self.isStarted = true;
                            var ballses = msg.balls;
                            var playersCount = ballses.length;
                            for (var i = 1; i < playersCount; i++) {
                                self.players.add([{
                                    id: i,
                                    radius: self.game.get("playersRadius"),
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
                        var playersCount = ballses.length;
                        if (!self.isStarted) {
                            self.isStarted = true;
                            for (var i = 1; i < playersCount; i++) {
                                self.players.add([{
                                    id: i,
                                    radius: self.game.get("playersRadius"),
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
                alert('WEBSOCKET CLOSED :C');
                Backbone.history.navigate('#', {trigger: true});
            };
            this.ws.onerror = function (event) {
                console.log("OMGWTFERROR!!!");
            }

        }

    });

    return new View();

});