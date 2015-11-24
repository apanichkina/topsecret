/**
 * Created by Ann on 21.09.15.
 */

define([
    'backbone',
    'tmpl/scoreboard',
    'models/scores',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    Score,
    scoreCollection
){

    var View = Backbone.View.extend({

        template: tmpl,
        collection: scoreCollection,

        initialize: function () {
            $('#page').append(this.el);

            this.listenTo(this.collection, this.collection.changed, this.render);

            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.collection.firstN(10)));
        },
        show: function () {
            this.collection.fetch();
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

    return new View();
});