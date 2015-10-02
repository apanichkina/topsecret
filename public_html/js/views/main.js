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

		          $('#page').append(this.el);
            this.render();
        },
        render: function () {
				        $('#page').addClass('cVHPW');
				        $(this.el).addClass('cVHP');
            this.$el.html(this.template);
        },
        show: function () {
            this.$el.show();
				        $('#page').addClass('cVHPW');
				        $(this.el).addClass('cVHP');
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
				        $('#page').removeClass('cVHPW');
				        $(this.el).removeClass('cVHP');
        }

    });

    return new View();
});