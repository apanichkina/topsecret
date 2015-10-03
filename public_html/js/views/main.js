/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/main',
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
            $('#page').append(this.el);
            this.render();
        },
        render: function () {
            $(this.el).addClass('main-menu');
            this.$el.html(this.template);
        },
        show: function () {
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});