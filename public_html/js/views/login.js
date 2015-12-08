define([
    'backbone',
    'tmpl/login'
], function(
    Backbone,
    tmpl
){
    var View = Backbone.View.extend({

        template: tmpl,

        events: {
            submit: "send"
        },

        initialize: function (userModel) {
            this.user = userModel;

            this.listenTo(this.user, this.user.USER_LOGIN_FAILED + " " + this.user.USER_LOGIN_SUCCESS + " " + this.user.USER_SIGN_UP_SUCCESS, function () {
                if(this.user.get('logged_in')) {
                    this.render();
                }
            });

            this.render();
        },
        render: function () {
            this.$el.html(this.template);
        },

        show: function () {

            if(this.user.get('logged_in')){
                Backbone.history.navigate('#', true);
                return;
            }

            this.$el.show();
            this.trigger('show', this);
        },

        hide: function () {
            this.$el.hide();
        },

        allFilled: function() {
            var isValid = true;
            this.$(".user-form__input").each(function(){
                if ($.trim($(this).val()).length == 0){
                    isValid = false;
                }
            });
            return isValid;
        },

        showError: function(message){
            this.$(".user-form__error").text(message).show();
        },

        send: function(event) {
            event.preventDefault();
            var self = this;

            if(!self.allFilled()){
                self.showError('All fields must be filled!');
                return;
            }

            var name = self.$("input[name=name]").val();
            var pass = self.$("input[name=password]").val();

            self.user.fetch({
                data: JSON.stringify({
                    name: name,
                    password: pass
                }),

                success: function(model, data) {
                    self.user.clear();
                    if(data.code == 1) {
                        self.showError(data.response.description);
                        self.user.trigger(self.user.USER_LOGIN_FAILED);
                        return;
                    }

                    self.user.set(_.extend(data.response, { logged_in: true }));

                    self.user.trigger(self.user.USER_LOGIN_SUCCESS);
                    console.log(self.user);
                },

                error: function(model, data) {
                    self.user.clear();
                    self.showError(data.response.description);
                }
            });
        }

    });

    return View;
});