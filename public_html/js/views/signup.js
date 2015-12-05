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

            this.listenTo(this.user, this.user.signupFailedEvent + " " + this.user.USER_SIGN_UP_SUCCESS + " " + this.user.USER_LOGIN_SUCCESS, function () {
                if(!this.user.get('logged_in')) {
                    this.$(".user-form__error").text(this.user.get('error')).show();
                } else {
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

            if(!this.allFilled()){
                this.$(".user-form__error").text("All fields must be filled!").show();
            }
            else if (!this.validLogin()) {
                this.$(".user-form__error").text("Wrong login!").show();
            }
            else if (!this.validEmail()) {
                this.$(".user-form__error").text("Wrong email!").show();
            }
            else if (!this.passwordMatch()) {
                this.$(".user-form__error").text("Passwords don't match!").show();
            }
            else {
                this.$(".user-form__error").hide();
                var pass = this.$("input[name=password]").val();
                var name = this.$("input[name=name]").val();
                var email = this.$("input[name=email]").val();

                this.user.save({
                    name: name,
                    password: pass,
                    email: email
                });
            }
        }
    });

    return View;
});