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

        /**
         * User events
         */
        USER_SIGN_UP_SUCCESS: 'signupCompleteEvent',
        signupFailedEvent: 'signupFailedEvent',
        USER_LOGIN_SUCCESS: 'loginCompleteEvent',
        logoutEvent: 'logoutEvent',
        loginFailedEvent: 'loginFailedEvent',

        lobbyChanged: 'lobbyChanged',
        createdLobby: 'createdLobby',
        click: "clickCode",

        //idAttribute: 'name',

        initialize: function() {
            var storage = window.localStorage;
            var list = function listCookies() {
                var theCookies = document.cookie.split(';');
                var aString = '';
                for (var i = 1 ; i <= theCookies.length; i++) {
                    aString += i + ' ' + theCookies[i-1] + "\n";
                }
                return aString;
            };
            var cookies = list();
            console.log(cookies);
        },

        loginSuccess: function (data) {
            this.clear();
            this.set({
                'email': data.response.email,
                'name': data.response.name,
                'id': 1,
                'logged_in': true
            });
            this.trigger(this.USER_LOGIN_SUCCESS);
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
                'id': 1
            });
            this.trigger(this.USER_SIGN_UP_SUCCESS);
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
