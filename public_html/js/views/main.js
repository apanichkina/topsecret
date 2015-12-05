define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({

        template: tmpl,
        events: {
            "click #js-logout": "logout"
        },

        initialize: function (userModel) {

            /**
             * Setting models
             * */
            this.user = userModel;

            /**
             *Setting Listeners
             * */
            this.listenTo(this.user, this.user.USER_SIGN_UP_SUCCESS + " " + this.user.USER_LOGIN_SUCCESS, function(){
                this.render();
                Backbone.history.navigate('#', true);
            });

            this.listenTo(this.user, this.user.logoutEvent, this.render);

            this.render();
        },

        render: function () {
            this.$el.html(this.template);

            if (this.user.get('logged_in')) {
                this.$('#js-login').hide();
                this.$('#js-signup').hide();
            }
            else {
                this.$('#js-logout').hide();
                this.$('#js-play').hide();
            }
        },

        show: function () {
            this.$el.show();
            this.trigger("show", this);
        },

        hide: function () {
            this.$el.hide();
        },

        logout: function () {
            this.user.destroy();
        }

    });

    return View;
});