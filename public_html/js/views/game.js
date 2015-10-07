/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/game',
    'models/user'
], function(
    Backbone,
    tmpl,
    userModel
){

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,

        initialize: function () {
            // TODO
        },
        render: function () {
            // TODO
        },
        show: function () {
            console.log(this.user.logged_in);
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});