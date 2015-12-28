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
        USER_SIGNUP_FAILED: 'signupFailedEvent',
        USER_LOGIN_SUCCESS: 'loginCompleteEvent',
        USER_LOGOUT: 'logoutEvent',
        USER_LOGIN_FAILED: 'loginFailedEvent',

        click: "clickCode",

        idAttribute: 'name'


    });

    return Model;

});
