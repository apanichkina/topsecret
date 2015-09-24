/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'views/login',
    'views/main',
    'views/scoreboard',
    'views/game',
    'views/manager'
], function(
    Backbone,
    loginScreen,
    mainScreen,
    scoreboardScreen,
    gameScreen,
    viewManager
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            '*default': 'defaultActions'
        },
        initialize: function () {
            viewManager.addView(scoreboardScreen);
            viewManager.addView(loginScreen);
            viewManager.addView(mainScreen);
            viewManager.addView(gameScreen);
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
        }
    });

    return new Router();
});