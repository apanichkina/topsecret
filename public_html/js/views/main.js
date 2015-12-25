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
            var self = this;

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

            this.listenTo(this.user, this.user.USER_LOGOUT, this.render);

            self.user.fetch({
                success: function(model, data) {
                    if(data.code == 0){
                        self.user.set(_.extend(data.response, { logged_in: true }));
                        self.user.trigger(self.user.USER_LOGIN_SUCCESS);
                    }
                }
            });
            this.render();
        },

        render: function () {
            var self = this;

            if (self.user.get('logged_in')) {
                this.$el.html(self.template({user: self.user.get('name')}));
                self.$('#js-login').hide();
                self.$('#js-signup').hide();
            } else {
                this.$el.html(self.template);
                self.$('#js-logout').hide();
                self.$('#js-play').hide();
            }

            this.$el.find('.js-open-qr').on('click', function (event) {
                event.preventDefault();
                Backbone.history.navigate('#qr', true);
            });

            this.$el.find('.js-hint-close').on('click', function (event) {
                self.$el.find('.how-to-play').fadeOut(750);
            });

            this.$el.find('.js-hint-enable').on('click', function (event) {
                self.$el.find('.how-to-play').fadeIn(750);
            });
        },

        show: function () {
            this.$el.show();
            this.trigger("show", this);
        },

        hide: function () {
            this.$el.hide();
        },

        logout: function () {
            var self = this;
            self.user.set({logged_in: false});
            this.user.destroy({
                success: function(){
                    self.user.trigger(self.user.USER_LOGOUT);
                }
            });
        }

    });

    return View;
});