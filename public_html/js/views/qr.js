/**
 * Created by Alex on 25.12.15.
 */
define([
    'backbone',
    'tmpl/qr'
], function (
    Backbone,
    tmpl
) {

    var View = Backbone.View.extend({

        template: tmpl,

        initialize: function (userModel, qrCodeModel) {
            this.user = userModel;
            this.qrModel = qrCodeModel;
            this.listenTo(this.qrModel, 'change', this.render)
        },

        render: function () {
            var self = this;
            this.$el.html(this.template);
            this.$el.find("#container").append("<img src='http://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + self.qrModel.getUrl() + "' />");

            this.$el.find(".js-leave-qr").on('click', function(event){
                event.preventDefault();
                Backbone.history.navigate('#', true);
            });
        },

        show: function(){
            if(!this.user.get('logged_in')){
                Backbone.history.navigate('#', true);
                return;
            }

            this.$el.fadeIn(750);
            this.trigger("show", this);
        },

        hide: function(){
            this.$el.hide();
        }
    });

    return View;
});