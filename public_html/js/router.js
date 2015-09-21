/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'views/login',
    'views/main',
    'views/scoreboard',
    'views/manager'
], function(
    Backbone,
    loginScreen,
    mainScreen,
    scoreboardScreen,
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
        },
        defaultActions: function () {
            mainScreen.show();
        },
        scoreboardAction: function () {
            alert('scoreboard viexal');
            scoreboardScreen.show();
        },
        gameAction: function () {
            // TODO
        },
        loginAction: function () {

        }
    });

    return new Router();
});