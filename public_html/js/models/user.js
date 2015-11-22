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
        loginFailedEvent: 'loginFailedEvent',
        joinedLobby: 'joinedLobby',
        createdLobby: 'createdLobby',

        loginSuccess: function (data) {
            this.clear();
            this.set({
                'email': data.response.email,
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
        }

    });

    return new UserModel();

});
