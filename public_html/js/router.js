/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'views/websocket',
    'views/login',
    'views/signup',
    'views/main',
    'views/scoreboard',
    'views/game',
    'views/manager',
    'views/lobby'
], function(
    Backbone,
    webSocket,
    loginScreen,
    signupScreen,
    mainScreen,
    scoreboardScreen,
    gameScreen,
    viewManager,
    lobbyScreen
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            'signup': 'signupAction',
            'lobby': 'lobbyAction',
            '*default': 'defaultActions'
        },
        initialize: function () {
            viewManager.addView(scoreboardScreen);
            viewManager.addView(loginScreen);
            viewManager.addView(mainScreen);
            viewManager.addView(gameScreen);
            viewManager.addView(signupScreen);
            viewManager.addView(lobbyScreen);
        },
        defaultActions: function () {
            mainScreen.show();
        },
        scoreboardAction: function () {
            scoreboardScreen.show();
        },
        gameAction: function () {
            gameScreen.show();
        },
        loginAction: function () {
            loginScreen.show();
        },
        signupAction: function () {
            signupScreen.show();
        },
        lobbyAction: function() {
            lobbyScreen.show();
        }
    });

    return new Router();
});