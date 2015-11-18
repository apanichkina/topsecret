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

        events: {
            "click #js-logout": "logout"
        },

        initialize: function () {
            $('#page').append(this.el);
            this.render();
            this.listenTo(this.user, this.user.signupCompleteEvent + " " + this.user.loginCompleteEvent, function(){
                this.render();
                Backbone.history.navigate('', {trigger: true});
            });

        },
        render: function () {
            this.$el.html(this.template);


            if (this.user.get('logged_in')) {
                this.$('#js-login').hide();
                this.$('#js-signup').hide();
                this.$('#js-play').show();
                this.$('#js-logout').show();
            }
            else {
                this.$('#js-logout').hide();
                this.$('#js-login').show();
                this.$('#js-signup').show();
                this.$('#js-play').hide();
            }

            return this;
        },
        show: function () {
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        },

        logout: function () {
            this.user.clear();
            this.render();
        }

    });

    return new View();
});