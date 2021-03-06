define([
    'backbone'

], function(
    Backbone
){

    var View = Backbone.View.extend({

        initialize: function (userModel, lobbyCollection, currentLobby, playerModel, playerCollection, gameModel, qrCodeModel) {

            this.user = userModel;
            this.lobbies = lobbyCollection;
            this.lobby = currentLobby;
            this.players = playerCollection;
            this.player = playerModel;
            this.game = gameModel;
            this.qrCode = qrCodeModel;

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
                var maxPlayers = self.lobby.get('maxPlayers');
                self.ws.send(JSON.stringify({code: 1, name: lobbyName, maxPlayers: maxPlayers}));
            });

            self.lobby.on(self.lobby.PLAYER_EXIT, function(){
                console.log('LEAVING');
                self.lobby.unsetTeams();
                self.player.set({ inLobby: false });
                self.ws.send(JSON.stringify({code: 8}));
                self.ws.send(JSON.stringify({code: 9}));
            });

            self.lobbies.on(self.lobbies.REQUEST_LOBBIES, function(){
                console.log('REQUESTING');
                self.ws.send(JSON.stringify({code: 9}));
            });

        },

        disconnect: function(event, view) {
            var self = view;

            /* unexpected close */
            if(self.user.get('logged_in')){
                self.socketError();
            }

            /**
             * Removing listeners
             */
            self.player.off(self.player.CREATED_LOBBY + " " + self.player.JOINED_LOBBY);
            self.lobby.off(self.lobby.PLAYER_EXIT);
            self.lobbies.off(self.lobbies.REQUEST_LOBBIES);

            /**
             * Clearing instances
             */
            self.user.clear();
            self.user.destroy({
                success: function(){
                    self.user.trigger(self.user.USER_LOGOUT);
                }
            });

            self.player.clear();
            self.lobby.unsetTeams();
            self.ws.close();
            self.ws = null;

            /* move user to main screen in case of unexpected ws crash */
            Backbone.history.navigate('#', true)
        },

        onSocketMessage: function(event, view) {
            var self = view;
            var msg = JSON.parse(event.data);
            var code = msg.code;
            switch (code) {
                case 0:
                    self.lobbies.set(msg.lobbies);
                    if(!msg.lobbies.length){
                        self.lobbies.trigger('change');
                    }
                    if(msg.mobile){
                        self.qrCode.setCode(msg.mobile);
                    }
                    break;
                case 1:
                    delete msg.code;
                    self.lobbies.add(msg);
                    break;
                case 2: //Create lobby response
                    console.log(msg);
                    delete msg.code;
                    self.player.set({ inLobby: true });
                    self.lobby.addPlayer(self.player.get('name'), 0);
                    Backbone.history.navigate('#lobby', true);
                    break;
                case 3: //Lobby exists
                    self.lobby.trigger(self.lobby.ALREADY_EXIST);
                    break;
                case 4: //joinLobby
                    self.lobby.set({ team: msg.users });
                    self.lobby.trigger(self.lobby.UPDATE);
                    Backbone.history.navigate('#lobby', true);
                    if(this.lobby.isFull()){
                        Backbone.history.navigate('#game', true);
                    }
                    break;
                case 5:// cant join
                    alert('code 5');
                    break;
                case 7: //user joins lobby
                    self.lobby.addPlayer(msg.user, msg.team);
                    if(this.lobby.isFull()){
                        Backbone.history.navigate('#game', true);
                    }
                    break;
                case 8://game start
                    console.log(msg);
                    self.game.set({isStarted: true, isEnded: false, team0: 0, team1: 0});
                        self.isStarted = true;
                        var ballses = msg.balls;
                        var playersCount = ballses.length;
                        self.players.reset();
                        self.players.add({
                            id: 0,
                            x: ballses[0].x.valueOf(),
                            y: ballses[0].y.valueOf(),
                            radius: self.game.get("ballRadius"),
                            type: "ball"
                        });
                        for (var i = 1; i < playersCount; i++) {
                            self.players.add([{
                                id: i,
                                name: ballses[i].name.substring(0,11),
                                radius: self.game.get("playersRadius"),
                                x: ballses[i].x.valueOf(),
                                y: ballses[i].y.valueOf(),
                                isMyPlayer: ballses[i].self.valueOf(),
                                team: ballses[i].team.valueOf()
                            }]);
                            if (ballses[i].self.valueOf() == true) {
                                self.game.set({myNumber: i});
                            }
                        }
                    break;
                case 10://current coordinate
                    self.game.set({isStarted: true, isEnded: false});
                    var ballses = msg.balls;
                    var playersCount = ballses.length;
                    if (!self.isStarted) {
                        self.isStarted = true;
                        collection.reset();
                        for (var i = 1; i < playersCount; i++) {
                            self.players.add([{
                                id: i,
                                name: ballses[i].name.substring(0,11),
                                radius: self.game.get("playersRadius"),
                                x: ballses[i].x.valueOf(),
                                y: ballses[i].y.valueOf(),
                                isMyPlayer: ballses[i].self.valueOf()
                            }
                            ]);
                            if (ballses[i].self.valueOf() == true) {
                                self.game.set({myNumber: i});
                            }
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
                case 11://game result
                    this.game.set({winner: msg.team, isEnded: true});
                    self.lobby.trigger(self.lobby.PLAYER_EXIT);
                    console.log(msg);
                    break;
                case 12://current score
                    console.log(msg);
                    this.game.set({team0: msg.team0, team1: msg.team1});
                    break;
                case 13:
                    var user = msg.name;
                    this.lobby.removePlayer(user);
                    break;
                default:
                    console.log(msg);
                    break;
            }
        },

        socketError: function () {
            /*animate the bar*/
            var bar = $('.js-bar');
            bar.slideDown();
            $('.js-error-close').on('click', function () {
                bar.slideUp()
            });
        }

});

    return View;

});