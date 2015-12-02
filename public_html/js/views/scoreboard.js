/**
 * Created by Ann on 21.09.15.
 */

define([
    'backbone',
    'tmpl/scoreboard'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({

        template: tmpl,

        initialize: function (scoreCollection) {

            this.collection = scoreCollection;

            this.listenTo(this.collection, this.collection.changed, this.render);

            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.collection.toJSON()));
        },
        show: function () {
            var self = this;
            this.collection.fetch({
                success: function(data) {
                    self.collection.setScores(data);
                },
                error: function() {
                    console.log("errAnn");
                    self.collection.setFromLocalStorage();
                }
            });
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        },

        supportsStorage: function() {
           try{
               return 'localStorage' in window && window['localStorage'] !== null;
           } catch(e) {
               return false;
           }
        }

    });

    return View;
});