define([
    'backbone'

], function(
    Backbone
){

    var View = Backbone.View.extend({

        initialize: function (userModel, lobbyCollection, currentLobby, playerModel, playerCollection, gameModel) {

            this.user = userModel;
            this.lobbies = lobbyCollection;
            this.lobby = currentLobby;
            this.players = playerCollection;
            this.player = playerModel;
            this.game = gameModel;

            this.listenTo(this.user, this.user.USER_LOGIN_SUCCESS + " " + this.user.USER_SIGN_UP_SUCCESS, this.connect);

            this.listenTo(this.user, this.user.click, function () {
                if(!this.ws) return;
                var code = this.user.get('clickCode');
                this.ws.send(JSON.stringify({code: code}));
            });
        },

        connect: function() {
            var self = this;

            /**
             * Setting player model for lobby navigating
             */
            self.player.set({
                name: self.user.get('name'),
                inLobby: false
            });

            /**
             * Setting WebSocket
             * @type {WebSocket}
             */

            self.ws = new WebSocket("ws://"+window.location.host+"/game/");
            self.ws.addEventListener('message', function(){ self.onSocketMessage(event, self) });
            self.ws.addEventListener('close', function(){ self.disconnect(event, self)});

            /**
             * Setting model listeners for WebSocket messages
             */

            self.player.on(self.player.JOINED_LOBBY, function(){
                console.log("JOINING");
                var lobbyName = self.lobby.get('name');
                self.ws.send(JSON.stringify({code: 2, lobby: lobbyName}));
            });

            self.player.on(self.player.CREATED_LOBBY, function(){
                console.log("CREATING");
                var lobbyName = self.lobby.get('name');
                self.ws.send(JSON.stringify({code: 1, name: lobbyName}));
            });

            self.lobby.on(self.lobby.PLAYER_EXIT, function(){
                console.log('LEAVING');
                self.lobby.unsetTeams();
                self.player.set({ inLobby: false });
                self.ws.send(JSON.stringify({code: 8}));
                Backbone.history.navigate('#lobbies', true);
            });

            self.lobbies.on(self.lobbies.REQUEST_LOBBIES, function(){
                console.log('REQUESTING');
                self.ws.send(JSON.stringify({code: 9}));
            });

        },

        disconnect: function(event, view) {
            var self = view;

            /**
             * Removing listeners
             */
            self.player.off(self.player.CREATED_LOBBY + " " + self.player.JOINED_LOBBY);
            self.lobby.off(self.lobby.PLAYER_EXIT);

            /**
             * Clearing instances
             */
            self.user.clear();
            self.player.clear();
            self.lobby.unsetTeams();
            self.ws.close();
            self.ws = null;
        },

        onSocketMessage: function(event, view) {
            var self = view;

            var msg = JSON.parse(event.data);
            var code = msg.code;
            switch (code) {
                case 0:
                    self.lobbies.set(msg.lobbies);
                    break;
                case 1:
                    //TODO OLEG!
                    delete msg.code;
                    self.lobbies.add(msg);
                    break;
                case 2: //Create lobby response
                    console.log(msg);
                    delete msg.code;
                    self.player.set({ inLobby: true });
                    self.lobby.addPlayer(self.player.get('name'), 0);
                    self.lobbies.add(msg);
                    Backbone.history.navigate('#lobby', true);
                    break;
                case 3: //Lobby exists
                    self.lobby.trigger(self.lobby.ALREADY_EXIST);
                    break;
                case 4: //joinLobby
                    self.lobby.set({ team: msg.users });
                    self.lobby.trigger(self.lobby.UPDATE);
                    Backbone.history.navigate('#lobby', true);
                    break;
                case 5:// cant join
                    alert('code 5');
                    break;
                case 7: //user joins lobby
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
                case 13:
                    var user = msg.name;
                    this.lobby.removePlayer(user);
                    break;
                case 14: // Lobby list
                    alert(14);
                    break;

                default:
                    console.log(msg);
                    break;
            }
        }
    });

    return View;

});