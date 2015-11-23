define([
    'backbone',
    'tmpl/lobbies',
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
            this.$el.html(this.template);
        },

        show: function () {

            if(this.user.get('logged_in')){
                Backbone.history.navigate('#', {trigger: true});
                return;
            }

            this.$el.show();
            this.trigger('show', this);
        },

        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});