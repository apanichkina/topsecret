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

        send: function (event) {
            event.preventDefault();
            alert(this.user.password);

            var pass = this.$("input[name=password]").val();

            if (!this.passwordMatch()) {
                this.$(".login-form__error").show();
            }
            else {
                this.$(".login-form__error").hide();
                this.user.password = pass;
            }

        }



    });

    return new View();
});