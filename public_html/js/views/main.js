/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({

        template: tmpl,

        initialize: function () {
            $('body').append(this.el);
            this.render();
        },
        render: function () {
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