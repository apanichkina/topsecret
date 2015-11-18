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
                    this.$(".user-form__error").text(this.user.get('error')).show();
                } else {
                    this.render();
                }
            });

            this.render();
        },
        render: function () {
            this.$el.html(this.template);
            this.$el.find('input').on('keyup', function(e){
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

        allFilled: function() {
            var isValid = true;
            this.$(".user-form__input").each(function(){
                if ($.trim($(this).val()).length == 0){
                    isValid = false;
                }
            });
            return isValid;
        },

        send: function(event) {
            event.preventDefault();

            if(!this.allFilled()){
                this.$(".user-form__error").text("All fields must be filled!").show();
                return;
            }

            var name = this.$("input[name=name]").val();
            var pass = this.$("input[name=password]").val();

            this.user.set("name", name);
            this.user.set("password", pass);

            this.user.fetch({
                name: name,
                password: pass
            });
        }

    });

    return new View();
});