/**
 * Created by Alex ot dushi da
 */

define([
    'backbone',
    'tmpl/signup',
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
            "submit": "send"
        },

        initialize: function () {
            $('#page').append(this.el);
            this.render();
        },

        render: function () {
            this.$el.html(this.template);
        },

        show: function () {
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

            if(!pw1 || !pw2){
                return false;
            }

            return pw1 === pw2;
        },

        allFilled: function() {
            var isValid = true;
            this.$(".login-form__input").each(function(formValid){
                if ($.trim($(this).val()).length == 0){
                    isValid = false;
                }
            });
            return isValid;
        },

        send: function (event) {
            event.preventDefault();

            if(!this.allFilled()){
                this.$(".login-form__error").text("All fields must be filled!").show();
            }
            else if (!this.passwordMatch()) {
                this.$(".login-form__error").text("Passwords don't match!").show();
            }
            else {
                this.$(".login-form__error").hide();
                var pass = this.$("input[name=password]").val();
                var name = this.$("input[name=name]").val();
                var email = this.$("input[name=email]").val();

                this.user.set("password", pass);
                this.user.set("email", email);
                this.user.set("name", name);
                this.user.set("logged_in", true);
                this.user.save();
                Backbone.history.navigate('', {trigger: true});
            }

        }


    });

    return new View();
});