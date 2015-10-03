/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'views/login',
    'views/signup',
    'views/main',
    'views/scoreboard',
    'views/game',
    'views/manager'
], function(
    Backbone,
    loginScreen,
    signupScreen,
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
            'signup': 'signupAction',
            '*default': 'defaultActions'
        },
        initialize: function () {
            viewManager.addView(scoreboardScreen);
            viewManager.addView(loginScreen);
            viewManager.addView(mainScreen);
            viewManager.addView(gameScreen);
            viewManager.addView(signupScreen);
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
        }
    });

    return new Router();
});