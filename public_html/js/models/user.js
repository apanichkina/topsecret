define([
    'backbone',
    'api/userSync'
], function(
    Backbone,
    userSync
) {

    var Model = Backbone.Model.extend({

        url: "/",
        sync: userSync,

        signupCompleteEvent: 'signupCompleteEvent',
        signupFailedEvent: 'signupFailedEvent',
        loginCompleteEvent: 'loginCompleteEvent',
        logoutEvent: 'logoutEvent',
        loginFailedEvent: 'loginFailedEvent',
        joinedLobby: 'joinedLobby',
        lobbyChanged: 'lobbyChanged',
        createdLobby: 'createdLobby',
        click: "clickCode",

        //idAttribute: 'name',

        loginSuccess: function (data) {
            this.clear();
            this.set({
                'email': data.response.email,
                'name': data.response.name,
                'id': 1,
                'logged_in': true
            });
            this.trigger(this.loginCompleteEvent);
        },

        loginFailed: function (data) {
            this.clear();
            this.set('error', data.response.description);
            this.trigger(this.loginFailedEvent);
        },

        signupSuccess: function(data) {
            this.clear();
            this.set({
                'email': data.response.email,
                'name': data.response.name,
                'logged_in': true,
                'id': 1,
            });
            this.trigger(this.signupCompleteEvent);
        },

        signupFailed: function (data) {
            this.clear();
            this.set('error', data.response.description);
            this.trigger(this.signupFailedEvent);
        },

        logOut: function() {
            this.clear();
            this.trigger(this.logoutEvent);
        }

    });

    return Model;

});
