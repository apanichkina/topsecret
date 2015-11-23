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
    collection
){

    var View = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('#page').append(this.el);
            this.collection = new collection();

            this.render();
        },
        render: function () {
            var storage = window.localStorage;
            var name;
            var score;
            for (var i = 0; i < storage.length; ++i){
                name = storage[i];
                score = storage[name];
                this.collection.set({name: name, score: score});
            }
            this.$el.html(this.template(this.collection.firstN(10)));
        },
        show: function () {
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});