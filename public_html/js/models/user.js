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
        loginCompleteEvent: 'loginCompleteEvent',

        /* Properties */
        logged_in: false,
        name: "",
        password: "",
        email: "",

        loginSuccess: function (data) {
            this.name = data.name;
            this.email = data.email;
            this.logged_in = true;
            this.trigger(this.loginCompleteEvent);
        },

        signupSuccess: function(data) {
            this.name = data.name;
            this.email = data.email;
            this.logged_in = true;
            this.trigger(this.signupCompleteEvent);
        }


    });

    return new UserModel();

});
