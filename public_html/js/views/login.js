/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/login',
    'models/user'
], function(
    Backbone,
    tmpl,
    userModel
){

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,

        events: {
            "submit": "send"
        },

        initialize: function () {
            $('#page').append(this.el);
            this.render();
        },
        render: function () {
            this.$el.html(this.template);
        },
        show: function () {
            this.$el.show();
            this.trigger('show', this);
        },
        hide: function () {
            this.$el.hide();
        },

        send: function(event) {
            event.preventDefault();
            this.user.save();
            Backbone.history.navigate('', {trigger: true});
        }

    });

    return new View();
});