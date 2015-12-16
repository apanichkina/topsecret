define([
    'backbone',
    'tmpl/signup'
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

            this.listenTo(this.user, this.user.USER_SIGNUP_FAILED + " " + this.user.USER_SIGN_UP_SUCCESS + " " + this.user.USER_LOGIN_SUCCESS, function () {
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

        // Helpers

        showError: function(message){
            this.$(".user-form__error").text(message).show();
        },

        passwordMatch: function () {
            var pw1 = this.$("input[name=password]").val();
            var pw2 = this.$("input[name=password_repeat]").val();

            return pw1 === pw2;
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

        validLogin: function() {
            var login = this.$("input[name=login]").val();
            var regex = /^[a-zA-Z\-]+$/;
            return regex.test(login);
        },

        validEmail: function () {
            var email = this.$("input[name=email]").val();
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        },

        send: function (event) {
            event.preventDefault();
            var self = this;

            if(!this.allFilled()){
                self.showError("All fields must be filled!");
            }
            else if (!this.validLogin()) {
                self.showError("Wrong login!");
            }
            else if (!this.validEmail()) {
                self.showError("Wrong email!");
            }
            else if (!this.passwordMatch()) {
                self.showError("Passwords don't match!");
            }
            else {
                this.$(".user-form__error").hide();
                var pass = this.$("input[name=password]").val();
                var name = this.$("input[name=name]").val();
                var email = this.$("input[name=email]").val();

                this.user.save(null, {
                    data: JSON.stringify({
                        name: name,
                        password: pass,
                        email: email
                    }),

                    success: function(model, data) {
                        self.user.clear();
                        if(data.code == 2) {
                            self.showError(data.response.description);
                            self.user.trigger(self.user.USER_SIGNUP_FAILED);
                            return;
                        }

                        self.user.set(_.extend(data.response, { logged_in: true }));

                        self.user.trigger(self.user.USER_SIGN_UP_SUCCESS);
                    },

                    error: function(model, data) {
                        self.user.clear();
                        self.showError(data.response.description);
                    }
                });
            }
        }
    });

    return View;
});