/**
 * Created by Alex on 03.10.15.
 */
define([
    'backbone'
], function(
    Backbone
) {

    var UserModel = Backbone.Model.extend({

        url: "/",

        logged_in: false,
        login: "",
        password: "",
        email: ""

    });

    return new UserModel();

});
