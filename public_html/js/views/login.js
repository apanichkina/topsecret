define([
    'backbone',
    'tmpl/login',
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
            "click .user-form__submit": "send",
            "enter": "send"
        },

        initialize: function () {
            $('#page').append(this.el);
            this.listenTo(this.user, this.user.loginFailedEvent + " " + this.user.loginCompleteEvent + " " + this.user.signupCompleteEvent, function () {
                if(!this.user.get('logged_in')) {
                    this.$(".user-form__error").text("Invalid credentials!").show();
                } else {
                    this.$(".user-form__error").text("Invalid credentials!").hide();
                }
            });

            this.render();
        },
        render: function () {
            this.$el.html(this.template);
            $('input').keyup(function(e){
                if(e.keyCode == 13){
                    $(this).trigger('enter');
                }
            });

        },
        show: function () {
            this.$el.show();
            this.trigger('show', this);
        },
        hide: function () {
            this.$el.hide();
        },

        send: function(event) {
            event.preventDefault();

            var name = this.$("input[name=name]").val();
            var pass = this.$("input[name=password]").val();

            this.user.set("name", "p1");
            this.user.set("password", "1");

            this.user.save();
        }

    });

    return new View();
});