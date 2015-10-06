/**
 * Created by Alex on 03.10.15.
 */
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


        logged_in: false,
        name: "",
        password: "",
        email: "",


        signupSuccess: function(data) {
            this.name = data.name;
            this.password = data.password;
            this.email = data.email;
            this.logged_in = true;
            this.trigger(this.signupCompleteEvent)
        }


    });

    return new UserModel();

});
