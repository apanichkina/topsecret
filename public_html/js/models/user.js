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

        loginSuccess: function (data) {
            this.set('email', data.response.email);
            this.set('logged_in', true);
            this.trigger(this.loginCompleteEvent);
        },

        loginFailed: function (data) {
            this.clear();
            this.trigger(this.loginFailedEvent);
        },

        signupSuccess: function(data) {
            this.set('logged_in', true);
            this.trigger(this.signupCompleteEvent);
        },

        signupFailed: function (data) {
            this.clear();
            this.trigger(this.signupFailedEvent);
        }


    });

    return new UserModel();

});
