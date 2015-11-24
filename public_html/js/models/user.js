define([
    'backbone',
    'api/userSync'
], function(
    Backbone,
    userSync
) {

    var UserModel = Backbone.Model.extend({

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

        idAttribute: 'name',

        loginSuccess: function (data) {
            this.clear();
            this.set({
                'email': data.response.email,
                'id': 1,
                'name': data.response.name,
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
                'logged_in': true
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

    return new UserModel();

});
