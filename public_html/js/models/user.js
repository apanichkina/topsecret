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
        USER_LOGOUT: 'logoutEvent',
        USER_LOGIN_FAILED: 'loginFailedEvent',

        click: "clickCode",

        //idAttribute: 'name',

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


    });

    return Model;

});
